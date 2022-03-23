export const fetchStudents = async (): Promise<any> => {
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getStudents`)
          .then(async response => {
            const data = await response.json()
            console.log('fetch', data.students)
            return data.students
          })
          .catch(error => {
            return error
          })
}
