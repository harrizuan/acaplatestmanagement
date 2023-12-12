import React, { useEffect } from 'react'
import Header from 'components/Headers/Header'
import { useLocation } from 'react-router-dom'
import { CardHeader, Col, Card } from 'reactstrap'

const Contract = () => {
    const location = useLocation()
    const data = location.state // Assuming the data is passed in the state
    const serial_number = data.serialNumber;

    useEffect(() =>   {
        // Fetch historical data of the device with serial_number from database 
    }, [serial_number])

    return (
        <>
            <Header />
            <Col className="order-xl-1" xl="12">
                <Card className="bg-default shadow">
                    <CardHeader className="bg-transparent border-0">
                        <h3 className="text-white mb-0">USER INFORMATION</h3>
                    </CardHeader>
                    <div className="container mt-4">
                        {data && (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Field</th>
                                        <th>Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(data).map(([key, value]) => (
                                        <tr key={key}>
                                            <td>{key}</td>
                                            <td>{typeof value === 'object' ? JSON.stringify(value) : value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </Card>
            </Col>
        </>
    )
}

export default Contract