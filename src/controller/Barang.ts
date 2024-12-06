
import { Request, Response } from "express";
import { PrismaClient , UserRole } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient ({ errorFormat: "pretty"})

export const getAllBarang = async (request: Request, response:Response ) => {
    try {
        const {search} = request.query;

        const allBarang = await prisma.barang.findMany ({
           

        })
        return response.json({
            status: true,
            data: allBarang,
            message: 'barang tidak tersedia'
        }).status(200)
    } catch (error) {
        return response.json({
            status: false,
            message: `there is an error: ${error}`
        })
        .status(400)
    }
}

export const getBarangbyID = async (req: Request, res: Response) => {
    try {
      
      const { id } = req.params;
     
      const barang = await prisma.barang.findUnique({
        where: { id: Number(id) }
      })
  
      if (!barang) {
        return res
        .status(404)
        .json({
           error: "Barang tidak ditemukan" 
          });
      }
  
      
      return res
        .status(200)
        .json({
          status: true,
          message: 'Barang berhasil ditampilkan',
          data: barang,
        });
    } catch (error) {
      return res
        .status(400)
        .json({
          status: false,
          message: `There is an error. ${error}`,
        });
    }
  };

export const createBarang = async (request: Request, response: Response ) => {
    try {
        const {name, category, quantity, location,} = request.body
        const uuid = uuidv4 ()

        const newBarang = await prisma.barang.create({
            data : {
            name,
            category,
            quantity: Number(quantity),
            location,
      },
    })
    return response.json({
        status: true,
        data: newBarang,
        message: 'NEW Barang TERSEDIA'
    }).status(200)
} catch (error) {
    return response.json({
        status: false,
        message: `there is an error: ${error}`
    })
    .status(400)
        }
    }

    export const updateBarang = async (request: Request, response: Response) => {
        try {
            const {id} = request.params
            const {name, category, quantity, location, description } = request.body 

            const findBarang= await prisma.barang.findFirst ({ where: { id: Number (id)}})
            if (!findBarang)  return response.status(200)
                .json ({status: false, message: 'Barang is not Found'})

            const updateBarang = await prisma.barang.update ({
                data : {
                    name: name || findBarang.name,
                    category: category || findBarang.category,
                    quantity: quantity ? Number(quantity) : findBarang.quantity, 
                    location: location || findBarang.location,

                },
                where: {id : Number(id)}
            })
            return response.json({
                status: true,
                data: updateBarang,
                message: 'ITEM has updated'
            }).status(200)
        } catch (error) {
            return response.json({
                status: false,
                message: `there is an error: ${error}`
            })
            .status(400)
        }
        }

        export const deleteBarang = async (request: Request, response:Response) => {
            try{
               
             const { id } = request.params
        
            const findMenu = await prisma.barang.findFirst ({ where : {id: Number(id) } })
            if (!findMenu) return response.status(200).json 
            ({status : false, message : 'Item is not found'})
        
            //process to delete menu's data.
            const deleteBarang = await prisma.barang.delete({
              where : {id : Number(id)}
            })
            return response.json({
              status: true,
              data:deleteBarang,
              message: 'item has deleted'
            }).status(200)
          } catch (error) {
            return response.json ({
              status: false,
              message: `There is an error. ${error}`
            })
            .status(400)
          }
        }



// peminjaman dan pengembalian
export const borrowBarang = async (request: Request, response: Response) => {
    try {
        const { user_id, barang_id, borrow_date, return_date } = request.body;
        const qty = 1;

        if (!user_id || !barang_id || !borrow_date || !return_date) {
            return response.status(400).json({
                status: false,
                message: "Semua field (user_id, barang_id, borrow_date, return_date) harus diisi.",
            });
        }

        const isDateValid = (date: string) => !isNaN(new Date(date).getTime());
        if (!isDateValid(borrow_date) || !isDateValid(return_date)) {
            return response.status(400).json({
                status: false,
                message: '"borrow_date" dan "return_date" harus dalam format ISO 8601.',
            });
        }

        const findUser = await prisma.user.findFirst({
            where: { id: Number(user_id) },
        });
        if (!findUser) {
            return response.status(404).json({
                status: false,
                message: `User dengan id: ${user_id} tidak ditemukan.`,
            });
        }

        const findBarang = await prisma.barang.findFirst({
            where: { id: Number(barang_id) },
        });
        if (!findBarang || findBarang.quantity === 0) {
            return response.status(400).json({
                status: false,
                message: "Barang tidak ditemukan atau stok habis.",
            });
        }

        const newBorrow = await prisma.peminjaman.create({
            data: {
                user_id: Number(user_id),
                barang_id: Number(barang_id),
                quantity: qty,
                borrow_date: new Date(borrow_date),
                return_date: new Date(return_date),
            },
        });

        await prisma.barang.update({
            where: { id: Number(barang_id) },
            data: { quantity: { decrement: qty } },
        });

        return response.status(200).json({
            status: true,
            data: newBorrow,
            message: "Peminjaman barang berhasil dicatat.",
        });
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: `Terjadi kesalahan. ${(error as Error).message}`,
        });
    }
};


// RETURNT BARANG
export const returnBarang = async (request: Request, response: Response) => {
    try {
        const { borrow_id, return_date } = request.body;

        // Validasi input
        if (!borrow_id || !return_date) {
            return response.status(400).json({
                status: false,
                message: "Field borrow_id dan return_date harus diisi.",
            });
        }

        // Cari data peminjaman
        const peminjaman = await prisma.peminjaman.findUnique({
            where: { id: Number(borrow_id) },
            select: { 
                quantity: true, 
                status: true, 
                barang_id: true, 
                return_date: true, // Periksa tanggal pengembalian dari database
            },
        });

        if (!peminjaman) {
            return response.status(404).json({
                status: false,
                message: "Data peminjaman tidak ditemukan.",
            });
        }

        if (peminjaman.status === 'kembali') {
            return response.status(400).json({
                status: false,
                message: "Barang sudah dikembalikan.",
            });
        }

        // Validasi tanggal pengembalian (telat atau tidak)
        const currentReturnDate = new Date(return_date);
        if (peminjaman.return_date && currentReturnDate > peminjaman.return_date) {
            return response.status(400).json({
                status: false,
                message: "Pengembalian barang terlambat.",
            });
        }

        // Update data peminjaman dan barang
        const updatedPeminjaman = await prisma.peminjaman.update({
            where: { id: Number(borrow_id) },
            data: {
                return_date: currentReturnDate,
                status: 'kembali',
            },
        });

        await prisma.barang.update({
            where: { id: Number(peminjaman.barang_id) },
            data: { quantity: { increment: peminjaman.quantity } },
        });

        return response.status(200).json({
            status: true,
            data: updatedPeminjaman,
            message: "Pengembalian barang berhasil dicatat.",
        });
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: `Terjadi kesalahan. ${(error as Error).message}`,
        });
    }
};


   