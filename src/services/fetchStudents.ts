export const fetchStudents = async (): Promise<any> => {
  await fetch(`${process.env.API_GATEWAY_URL}/students`)
          .then(async response => {
            const data = await response.json()
            return data.students
          })
          .catch(error => {
            return error
          })
}
