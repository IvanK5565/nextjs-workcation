import {db} from "./pages/api/db"
async function test() {

  const [res] = await db.query(`select count(*) from users where banned=0 and graduated=0 and role='student';`);
  console.log(res[0]['count(*)']);
}

test();