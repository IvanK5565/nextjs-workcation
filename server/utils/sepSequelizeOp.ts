import { Op } from "sequelize";

function setOpImmutable(filter: any, keys: string[], op: keyof typeof Op) {
  return Object.fromEntries(
    Object.entries(filter).map(([key, field]) => {
      if (keys.includes(key)) {
        return [key, {
          [Op[op]]: field
        }];
      }
      return [key, field];
    })
  )
}
function setOp(filter: any, keys: string[], op: keyof typeof Op) {
  keys.forEach(key => {
    if (key in filter) {
      filter[key] = {
        [Op[op]]: filter[key]
      }
    }
  })
  return Object.fromEntries(
    Object.entries(filter).map(([key, field]) => {
      if (keys.includes(key)) {
        return [key, {
          [Op[op]]: field
        }];
      }
      return [key, field];
    })
  )
}

export {
  setOp,
  setOpImmutable,
}