import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Analisis Penggunaan Barang
export const analisis = async (request: Request, response: Response) => {
  const { start_date, end_date, group_by } = request.body;

  if (!start_date || !end_date || !group_by) {
    return response.status(400).json({
      status: "error",
      message:
        "Tanggal mulai, tanggal akhir, dan kriteria pengelompokan harus diisi.",
    });
  }

  const startDate = new Date(start_date);
  const endDate = new Date(end_date);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return response.status(400).json({
      status: "error",
      message: "Format tanggal tidak valid.",
    });
  }

  try {
    let usageReport;
    let additionalInfo: Array<{ id: number; [key: string]: any }> = [];

    // Query penggunaan barang berdasarkan kriteria pengelompokan
    if (group_by === "category") {
      usageReport = await prisma.peminjaman.groupBy({
        by: ["barang_id"], // Correct grouping by barang_id
        where: {
          borrow_date: {
            gte: startDate,
            lte: endDate, // Filter based on date range
          },
        },
        _count: {
          barang_id: true,
        },
        _sum: {
          quantity: true,
        },
      });

      // KATEGORI
      const ids = usageReport.map((item) => item.barang_id);
      additionalInfo = await prisma.barang.findMany({
        where: {
          id: { in: ids }, // Correct referencing `id`
        },
        select: { id: true, category: true },
      });
    } else if (group_by === "location") {
      usageReport = await prisma.peminjaman.groupBy({
        by: ["barang_id"], // Group by barang_id
        where: {
          borrow_date: {
            gte: startDate,
            lte: endDate, // Filter based on date range
          },
        },
        _count: {
          barang_id: true,
        },
        _sum: {
          quantity: true,
        },
      });

      // Lokasi
      const ids = usageReport.map((item) => item.barang_id);
      additionalInfo = await prisma.barang.findMany({
        where: {
          id: { in: ids }, // Use `id` to reference barang
        },
        select: { id: true, location: true },
      });
    } else {
      return response.status(400).json({
        status: "error",
        message:
          "Kriteria pengelompokan tidak valid. Gunakan 'category' atau 'location'.",
      });
    }

    // Menghitung peminjaman yang sudah dikembalikan
    const returnedItems = await prisma.peminjaman.groupBy({
      by: ["barang_id"],
      where: {
        borrow_date: {
          gte: startDate,
        },
        return_date: {
          gte: startDate,
          lte: endDate,
        },
        status: "kembali", // 'status' value from your enum
      },
      _count: {
        barang_id: true,
      },
      _sum: {
        quantity: true,
      },
    });

    // Menghitung peminjaman yang belum dikembalikan
    const notReturnedItems = await prisma.peminjaman.groupBy({
      by: ["barang_id"],
      where: {
        borrow_date: {
          gte: startDate,
        },
        OR: [
          {
            return_date: {
              gt: endDate, // Late return is after the end_date
            },
          },
          {
            return_date: {
              equals: null, // If no return_date, it means not returned
            },
          },
        ],
      },
      _count: {
        barang_id: true,
      },
      _sum: {
        quantity: true,
      },
    });

    // Menyusun hasil analisis untuk respons
    const usageAnalysis = usageReport.map((item) => {
      const info = additionalInfo.find(
        (info) => info.id === item.barang_id // Correct reference by `id`
      );
      const returnedItem = returnedItems.find(
        (returned) => returned.barang_id === item.barang_id
      );
      const totalReturned = returnedItem?._count?.barang_id ?? 0; // Handle null count
      const itemsInUse = item._count.barang_id - totalReturned;
      return {
        group: info ? info[group_by as keyof typeof info] : "Unknown",
        total_borrowed: item._count.barang_id,
        total_returned: totalReturned,
        items_in_use: itemsInUse,
      };
    });

    response.status(200).json({
      status: "success",
      data: {
        analysis_period: {
          start_date: startDate.toISOString().split("T")[0],
          end_date: endDate.toISOString().split("T")[0],
        },
        usage_analysis: usageAnalysis,
      },
      message: "Laporan penggunaan barang berhasil dihasilkan.",
    });
  } catch (error) {
    response.status(500).json({
      status: "error",
      message: `Terjadi kesalahan. ${(error as Error).message}`,
    });
  }
};

// Analisis Peminjaman Barang (Frequent Borrowed and Late Returns)
export const borrowAnalysis = async (request: Request, response: Response) => {
  const { start_date, end_date } = request.body;

  // Validasi input
  if (!start_date || !end_date) {
    return response.status(400).json({
      status: "error",
      message: "Tanggal mulai dan tanggal akhir harus diisi.",
    });
  }

  const startDate = new Date(start_date);
  const endDate = new Date(end_date);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return response.status(400).json({
      status: "error",
      message: "Format tanggal tidak valid.",
    });
  }

  try {
    // Query untuk mendapatkan barang paling sering dipinjam
    const frequentlyBorrowedItems = await prisma.peminjaman.groupBy({
      by: ["barang_id"],
      where: {
        borrow_date: {
          gte: startDate,
        },
        return_date: {
          lte: endDate,
        },
      },
      _count: {
        barang_id: true,
      },
      orderBy: {
        _count: {
          barang_id: "desc",
        },
      },
    });

    // Mendapatkan informasi tambahan untuk barang paling sering dipinjam
    const frequentlyBorrowedItemDetails = await Promise.all(
      frequentlyBorrowedItems.map(async (item) => {
        const barang = await prisma.barang.findUnique({
          where: { id: item.barang_id }, // Correct reference for `id`
          select: { id: true, name: true, category: true },
        });
        return barang
          ? {
              item_id: item.barang_id,
              name: barang.name,
              category: barang.category,
              total_borrowed: item._count.barang_id,
            }
          : null;
      })
    ).then((results) => results.filter((item) => item !== null));

    // Query untuk mendapatkan barang dengan telat pengembalian
    const inefficientItems = await prisma.peminjaman.groupBy({
      by: ["barang_id"],
      where: {
        borrow_date: {
          gte: startDate,
        },
        return_date: {
          gt: endDate, // Late return condition
        },
      },
      _count: {
        barang_id: true,
      },
      _sum: {
        quantity: true,
      },
      orderBy: {
        _count: {
          barang_id: "desc",
        },
      },
    });

    // Mendapatkan informasi tambahan untuk barang yang telat pengembalian
    const inefficientItemDetails = await Promise.all(
      inefficientItems.map(async (item) => {
        const barang = await prisma.barang.findUnique({
          where: { id: item.barang_id }, // Correct reference for `id`
          select: { id: true, name: true, category: true },
        });
        return barang
          ? {
              item_id: item.barang_id,
              name: barang.name,
              category: barang.category,
              total_borrowed: item._count.barang_id,
              total_late_returns: item._sum.quantity ?? 0, // Handle missing quantity
            }
          : null;
      })
    ).then((results) => results.filter((item) => item !== null));

    response.status(200).json({
      status: "success",
      data: {
        analysis_period: {
          start_date: start_date,
          end_date: end_date,
        },
        frequently_borrowed_items: frequentlyBorrowedItemDetails,
        inefficient_items: inefficientItemDetails,
      },
      message: "Analisis barang berhasil dihasilkan.",
    });
  } catch (error) {
    response.status(500).json({
      status: "error",
      message: `Terjadi kesalahan. ${(error as Error).message}`,
    });
  }
};
