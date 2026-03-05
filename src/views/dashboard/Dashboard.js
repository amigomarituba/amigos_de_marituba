import { CCol, CRow, CWidgetStatsB } from '@coreui/react'
import { useEffect, useRef, useState } from 'react'
import { instanceAxios } from '../../config/api'
import { CChart } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'

const Dashboard = () => {
  const chartRef = useRef(null)

  const [totalAgendamentos, setTotalAgendamentos] = useState(0)
  const [totalAusencias, setTotalAusencias] = useState(0)
  const [totalPresencas, setTotalPresencas] = useState(0)
  const [graficService , setGraficService] = useState([])
  const [ total, setTotal ] = useState({})
  const [totalLider, setTotalLider ] = useState({})

  const api = async ()=>{
    try {

      const total = await instanceAxios.get('/report/dashboard/total')
      const grafic_services = await instanceAxios.get('/report/dashboard/grafic')
      const data_leaders = await instanceAxios.get('/report/dashboard/leaders')
      const total_agendamentos = await instanceAxios.get('/report/dashboard/schedulings')

      
      setTotalLider(data_leaders.data)
      setTotal(total.data[0] ? total.data[0] : {citizen:0,leader:0})
      setGraficService(grafic_services.data)
  
      setTotalAgendamentos(total_agendamentos.data[0] ? total_agendamentos.data[0].total : 0 )
      setTotalAusencias(total_agendamentos.data[0] ? total_agendamentos.data[0].absence : 0)
      setTotalPresencas(total_agendamentos.data[0] ? total_agendamentos.data[0].attendance : 0)
    } catch{
      localStorage.clear()
    }
    
  }
  
  useEffect(()=>{
   
    api()

  },[])

  const data = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio ', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro','Novembro','Dezembro'], // 9 labels
    datasets: graficService,
    //[
    //   {
    //     label: 'Clinico Geral',
    //     backgroundColor: '#6261cc',
    //     borderColor: '#6261cc',
    //     data: [4, 20, 10, 5, 0, 3, 25, 7, 20, 6, 32, 14],
    //   },
    //   {
    //     label: 'Odontologia',
    //     backgroundColor: '#fff',
    //     borderColor: '#fff',
    //     data: [5, 2, 10, 29, 10, 46, 9, 0, 20, 2, 3, 10],
    //   },

    //   {
    //     label: 'Psicilogo',
    //     backgroundColor: '#3399FF',
    //     borderColor: '##3399FF',
    //     data: [4, 0, 0, 23, 5, 0, 9, 8, 25, 2, 4, 1],
    //   },

    //   {
    //     label: 'RG',
    //     backgroundColor: '#249542',
    //     borderColor: '#249542',
    //     data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 25, 42, 100],
    //   },
    // ],
  }

  const options = {
    plugins: {
      legend: {
        labels: {
          color: getStyle('--cui-body-color'),
        },
      },
    }, 
    scales: {
      x: {
       
        ticks: {
          color: getStyle('--cui-body-color'),
        }, 
        type: 'category',
      },
      y: {
        ticks: {
          color: getStyle('--cui-body-color'),
        },
        beginAtZero: true,
      },
    },
  }

  return (
    <CCol>
      <CRow >
        <h4 className='mb-3'>Registros</h4>
        <CCol>
          <CWidgetStatsB
            className="mb-3"
            inverse
            progress={{ value:total.citizen}}
            style={{
              fontSize:17
            }}
            title="Cidadões"
            text='Cidadões Cadastrados no Sistema'
            value={total.citizen}
          />
        </CCol>

        <CCol>
        <CWidgetStatsB
            className="mb-3"
            inverse
            progress={{ value: total.leader  }}
            title="Lideres"
            text='Lideres Cadastrados no Sistema'
            value={ total.leader }
          />
        </CCol>
      </CRow>
      <CRow >
        <h4 className='mb-3'>Agendamentos</h4>
        <CCol>
          <CWidgetStatsB
            className="mb-3"
            color="success"
            inverse
            progress={{ value: totalAgendamentos }}
            title="Total"
            text='Agendamentos Registrados'
            value={totalAgendamentos}
          />
        </CCol>

        <CCol>
        <CWidgetStatsB
            className="mb-3"
            color="primary"
            inverse
            progress={{ value: totalPresencas }}
            title="Compareceram"
            text='cidadões que compareceram'
            value={totalPresencas}
          />
        </CCol>

        <CCol>
        <CWidgetStatsB
            className="mb-3"
            color="danger"
            inverse
            progress={{ value: totalAusencias }}
            title="Não compareceram"
            text='Cidadões que não comparecerão'
            value={totalAusencias}
          />
        </CCol>
      </CRow>

      <CRow style={{justifyContent:'center', marginTop:20, marginBottom:45}} className=''>
        <h4>Serviços por Mês</h4>
          <CChart type="bar" style={{width:'80%'}} options={options} data={data} ref={chartRef} />
      </CRow>

      <CRow style={{justifyContent:'center', marginTop:20, marginBottom:45}}>
        <h3>Agendamentos por Líder</h3>
          <CChart type="bar" style={{width:'80%'}} options={options} data={totalLider} ref={chartRef} />
      </CRow>
      
    </CCol>

  )
}

export default Dashboard
