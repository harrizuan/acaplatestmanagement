import React, { useEffect, useState, useMemo } from "react";
import {
  Button,
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { FaLaptop, FaUser } from "react-icons/fa";
import { TailSpin } from 'react-loader-spinner';


const Index = (props) => {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "assets"));
        const list = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setData(list);
        setLoading(false);
        // Update the total count
        setTotalCount(list.length);
      } catch (err) {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const aggregateData = (key) => {
    return data.reduce((acc, item) => {
      const value = item[key];
      if (value) {
        acc[value] = (acc[value] || 0) + 1;
      }
      return acc;
    }, {});
  };

  const departmentData = useMemo(() => aggregateData('department'), [data]);
  const equipmentData = useMemo(() => aggregateData('equipment'), [data]);
  const locationData = useMemo(() => aggregateData('location'), [data]);
  const userData = useMemo(() => aggregateData('user'), [data]);

  const renderTable = (title, data) => (
    <Card className="shadow">
      <CardHeader className="border-0">
        <Row className="align-items-center">
          <div className="col">
            <h3 className="mb-0">{title}</h3>
          </div>
          <div className="col text-right">
            <Button color="primary" href="#pablo" onClick={(e) => e.preventDefault()} size="sm">
              See all
            </Button>
          </div>
        </Row>
      </CardHeader>
      <Table className="align-items-center table-flush" responsive>
        <thead className="thead-light">
          <tr>
            <th scope="col">{title}</th>
            <th scope="col">Amount</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([key, count]) => (
            <tr key={key}>
              <th scope="row">{key}</th>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <TailSpin
          color="#172b4d"
          height={100}
          width={100}
        />
      </div>
    );
  }
  if (error) return <p>Error loading data!</p>;

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row >
          <Col xl="6">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center justify-content-between">
                  <div className="col-auto">
                    {/* Display the total count and label */}
                    <h2 style={{ color: '#172b4d', fontWeight: 'bold' }}>
                      {totalCount}
                    </h2>
                    <h6 className="text-muted" style={{ fontSize: '0.8rem' }}>
                      Total Assets
                    </h6>
                  </div>
                  <div className="col-auto">
                    {/* Laptop icon with some transparency */}
                    <FaLaptop style={{ fontSize: '2rem', opacity: 0.7 }} />
                  </div>
                </Row>
              </CardHeader>
            </Card>
          </Col>
          <Col xl="6">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center justify-content-between">
                  <div className="col-auto">
                    {/* Display the total count and label */}
                    <h2 style={{ color: '#172b4d', fontWeight: 'bold' }}>
                      {Object.keys(userData).length}
                    </h2>
                    <h6 className="text-muted" style={{ fontSize: '0.8rem' }}>
                      Total Users
                    </h6>
                  </div>
                  <div className="col-auto">
                    {/* Laptop icon with some transparency */}
                    <FaUser style={{ fontSize: '2rem', opacity: 0.7 }} />
                  </div>
                </Row>
              </CardHeader>
            </Card>
          </Col>

        </Row>
        <Row className="mt-3">
          <Col xl="4">
            {renderTable("Department", departmentData)}
          </Col>
          <Col xl="4">
            {renderTable("Equipment", equipmentData)}
          </Col>
          <Col xl="4">
            {renderTable("Location", locationData)}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
