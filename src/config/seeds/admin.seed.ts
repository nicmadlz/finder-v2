import { DataSource } from "typeorm";
import { UserEntity } from "src/auth/user.entity";
import { Role } from "src/auth/enums/role.enum";
import bcrypt from "bcrypt"
import AppDataSource  from "../data-source"

async function seed(dataSource: DataSource) {
    const userRepository = dataSource.getRepository(UserEntity);
    const existAdmin = await userRepository.findOne({
        where: {
            role: Role.ADMIN
        }
    })

    if (!existAdmin) {
        const password = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);
        const admin = userRepository.create({
            name: 'Admin',
            email: process.env.ADMIN_EMAIL!,
            password,
            role: Role.ADMIN
        });
        await userRepository.save(admin);
        console.log('Admin created!');
    }

}
AppDataSource.initialize()
    .then(async (dataSource) => {
        await seed(dataSource);
        await dataSource.destroy();
        console.log('Seed finished!');
    })
    .catch(console.error);