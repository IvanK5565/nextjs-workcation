import { Sequelize } from "sequelize";

async function test(){

    const sequelize = new Sequelize("school-diary", "school-diary", "school-diary", {
        host: "127.0.0.1",
        dialect: "mysql"
    })
    
    const [res] = await sequelize.query(`select count(*) from \`school-diary\`.\`USERS\` where banned=0 and graduated=0 and role='student';`);
    console.log(res[0]['count(*)']);
}

test();