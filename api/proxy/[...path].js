// import axios from 'axios'

// export default async function handler(req, res) {
//   try {
//     const { path = [] } = req.query
//     const url = `${import.meta.env.VITE_URL_API}/${path.join('/')}`
//     const response = await axios({
//       method: req.method,
//       url: url,
//       data: req.body,
//       headers: { ...req.headers, host: undefined },
//       validateStatus:()=>true
//     })

//     res.status(response.status).json(response.data)
//   } catch (error) {
//     res.status(500).json({
//       error: error.menssage,
//     })
//   }
// }
