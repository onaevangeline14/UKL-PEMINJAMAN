import { Request, Response } from "express";
import { PrismaClient, UserRole } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import {sign} from "jsonwebtoken";
import fs from "fs"
import { SECRET } from "../global";
import md5 from "md5"




const prisma = new PrismaClient({ errorFormat: "pretty" });


export const getAllUser = async (request: Request, response: Response) => {
  try {
    const {search} = request.query
    const allUser = await prisma.user.findMany ({
      where: {
        OR: [
          {username: {contains: search?.toString () || ""}},
        ]
      }
    })

      return response.json({
          status: true,
          data: allUser,
          message: 'user has retrieved',
      }).status(200);
  } catch (error) {
      return response.json({
          status: false,
          message: `There was an error: ${error}`,
      }).status(400);
  }
};

export const createUser = async (request: Request, response: Response) => {
    try {
      const { username, password, role } = request.body;
      const uuid = uuidv4();
  
      const existingUser = await prisma.user.findUnique({
        where: { username: username,
        },
      });
  
      if (existingUser) {
        return response.status(400).json({
          status: false,
          message: "Username sudah di pakai",
        });
      }
  
      // Membuat pengguna baru jika username belum digunakan
      const newUser = await prisma.user.create({
        data: { uuid, username, password: md5(password), role },
      });
  
      return response.status(200).json({
        status: true,
        data: newUser,
        message: "New User has been created"
      });
    } catch (error) {
      return response.status(400).json({
        status: false,
        message: `There is an error. ${(error as Error).message}`,
      });
    }
  };
// export const createUser = async (request: Request, response: Response) => {
//   try {
//       const { username, password, role } = request.body;
//       const uuid = uuidv4();

//       const findUsername = await prisma.user.findFirst({where: {username}})
//       if (findUsername){
//           return response.status(400).json({
//               status: false,
//               message: `Invalid role. Expected one of: ${Object.values(role).join(", ")}`,
//           });
//       }

//       const newUser = await prisma.user.create({
//           data: {
//               username,
//               password: md5(password), 
//               role,
//           },
//       });

//       return response.status(200).json({
//           status: true,
//           data: newUser,
//           message: "user has been created",
//       });
//   } catch (error) {
//       return response.status(400).json({
//           status: false,
//           message: `Error: ${error}`,
//       });
//   }
// };
  
export const updateUser = async (request : Request, response: Response) => {
  try {
    const {id} = request.params
    
    const findUser = await prisma.user.findFirst ({ where: {id: Number(id)} })
    if (!findUser)
      return response.status(200).json({
          status: false,
          message: 'User tidak ditemukan',
      });
 const {username,password} = request.body

      const updatedUser = await prisma.user.update({
        where : {id: Number(id)},
        data : {
          username: username ?? findUser.username,
          password: password ? md5(password) : findUser.password
        }
      })

  return response.json({
    status: true,
    data: updatedUser,
    message: 'User telah diperbarui',
}).status(200);
} catch (error) {
return response.json({
    status: false,
    message: `Error: ${error}`,
}).status(400);
}
};

export const deleteUser = async (request: Request , response: Response) => {
  try{
    const { id } = request.params;
    const findUser = await prisma.user.findFirst({ where: { id: Number(id) } });
        if (!findUser) {
            return response.status(200).json({
                status: false,
                message: "user tidak ditemukan"
            });
        }
        const deleteUser = await prisma.user.delete({
          where: { id: Number(id) },
      });

      return response.status(200).json({
          status: true,
          data: deleteUser,
          message: "User telah dihapus",
      });
      
  } catch (error) {
      return response.status(400).json({
          status: false,
          message: `Terjadi error: ${error}`,
      });
  }
};
 

export const authentication= async(request:Request,response:Response) =>{
    try {
        const {username, password} =request.body

        const findUser = await prisma.user.findFirst({
            where: { username,password: md5(password) }
        })
        
        if(!findUser)
        return response
            .status(200)
            .json({
             status: false,
             logged: false,
             message: `username or password is invalid `
            });

            let data={
                id:findUser.id,
                username:findUser.username,
                role:findUser.role,
            }

            let payload=JSON.stringify(data)

            let token=sign(payload, SECRET || "token")

            return response
            .status(200)
            .json({status:true, logged: true, message:`Login Success `, token})
            
    } catch (error) {
        return response.json({
            status: false,
            massage:`There is an error. ${error} `
            })
            .status(400)
    }
}