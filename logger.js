const logger = require("logger").createLogger()

const alz = n => (n <= 9 ? "0" + n : n)

logger.format = (level, date, message) => {
  const fmtDate = `${alz(date.getDate())}.${alz(
    date.getMonth()
  )}.${date.getFullYear()}-${alz(date.getHours())}:${alz(
    date.getMinutes()
  )}:${alz(date.getSeconds())}`
  return `${fmtDate.toString()} | ${level.toUpperCase()} : ${message}`
}
module.exports = logger
