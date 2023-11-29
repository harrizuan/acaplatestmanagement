import React, { useState, useCallback, useMemo } from 'react';
import {
  Button, Card, CardHeader, CardBody,
  FormGroup, Form, Input, Container, Row, Col, Alert
} from "reactstrap";
import Header from "components/Headers/Header";
import { db } from '../../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

// Constants for dropdown options
const departments = [
  'UEM Builders & Lestra',
  'FISB & Property and Administration',
  'Communications & Yayasan UEM',
  'Human Resources & Secretarial',
  'Transformation, Technical & Special Project',
  'Finance',
  'ICT',
  'Chairman, MD Office, Corporate Support Services, Corporate Finance, Legal',
  'OTHERS',
  'PROHAWK & IRAT'
];

const equipmentOptions = [
  'Adapter',
  'Desktop',
  'Dock',
  'Ipad',
  'Keyboard',
  'Laptop',
  'Monitor',
  'Mouse',
  'Pen',
  'Phone',
  'Power Adapter',
  'Printer'
];

const fieldPairs = [
  ['model', 'serialNumber'],
  ['tagging', 'hostname'],
  ['user', 'location']
];

const FormAsset = () => {
  const [formData, setFormData] = useState({
    department: '', equipment: '', model: '',
    serialNumber: '', tagging: '', hostname: '', user: '', location: '',
  });

  const [showAlert, setShowAlert] = useState(false);

  const handleInput = useCallback((e) => {
    setFormData(fData => ({ ...fData, [e.target.name]: e.target.value }));
  }, []);

  const isFormEmpty = useMemo(() => {
    // Exclude the "hostname" field from the check
    const { hostname, ...formDataWithoutHostname } = formData;
    return !Object.values(formDataWithoutHostname).every(field => field.trim() !== '');
  }, [formData]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (isFormEmpty) {
      alert('Please fill in the form first.');
      return;
    }
    try {
      await addDoc(collection(db, "assets"), {
        ...formData,
        timeStamp: serverTimestamp(),
      });
      setFormData({
        department: '', equipment: '', model: '',
        serialNumber: '', tagging: '', hostname: '', user: '', location: '',
      });
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        window.location.reload(); // Refresh the page
      }, 3000); // 3 seconds delay
    } catch (err) {
      console.error(err);
    }
  };

  const renderDropdown = (label, name, options) => (
    <FormGroup>
      <label className="form-control-label" htmlFor={name}>
        {label}
      </label>
      <Input
        type="select"
        name={name}
        id={name}
        value={formData[name]}
        onChange={handleInput}
        className="form-control-alternative"
      >
        <option value="">Select {label}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </Input>
    </FormGroup>
  );

  const renderInputField = (field) => (
    <Col lg="6">
      <FormGroup>
        <label className="form-control-label" htmlFor={field}>
          {field.charAt(0).toUpperCase() + field.slice(1)}
        </label>
        <Input
          className="form-control-alternative"
          id={field}
          name={field}
          value={formData[field]}
          onChange={handleInput}
          placeholder={`Enter ${field}`}
          type="text"
        />
      </FormGroup>
    </Col>
  );

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-default shadow">
              <CardHeader className="bg-default border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="text-white mb-0">ASSET FORM</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody className="bg-secondary shadow">
                {showAlert && (
                  <Alert color="success">
                    <strong>Success!</strong> New asset has been added.
                  </Alert>
                )}
                <Form onSubmit={handleAdd}>
                  <h6 className="heading-small text-muted mb-4">
                    Asset information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        {renderDropdown('Department', 'department', departments)}
                      </Col>
                      <Col lg="6">
                        {renderDropdown('Equipment', 'equipment', equipmentOptions)}
                      </Col>
                    </Row>
                    {fieldPairs.map((pair, index) => (
                      <Row key={index}>
                        {pair.map(field => renderInputField(field))}
                      </Row>
                    ))}
                  </div>
                  <Button color="default" type="submit" disabled={isFormEmpty}>
                    Submit
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default FormAsset;
