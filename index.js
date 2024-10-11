const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main(){
    const newAdmin = await prisma.admin.create({
        data: {
          email: 'alex@example.com',
         senha: '123',
        }
      });
    
      console.log('Novo usuário:', newAdmin);
}

main()