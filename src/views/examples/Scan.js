import React, { useState, useEffect, useRef } from 'react';
import QrScanner from 'qr-scanner';
import 'qr-scanner/qr-scanner-worker.min.js'; // Import the QR scanner worker script
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import {
    Button, Card, CardHeader, CardBody,
    Container, Row, Col, Form, FormGroup, InputGroup, InputGroupAddon,
    InputGroupText, Input, Label, ListGroup, ListGroupItem
} from "reactstrap";
import Header from "components/Headers/Header";
import { FaCamera } from 'react-icons/fa';

const Scan = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchId, setSearchId] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showCamera, setShowCamera] = useState(false); // Control camera visibility
    const videoRef = useRef(null);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        QrScanner.WORKER_PATH = '/node_modules/qr-scanner/qr-scanner-worker.min.js'; // Adjust the path to the worker script
        if (showCamera) {
            const scanner = new QrScanner(videoRef.current, (result) => {
                setSearchId(result);
            });

            // Start the scanner
            scanner.start();

            return () => {
                // Stop the scanner when the component unmounts or camera is hidden
                scanner.stop();
            };
        }
    }, [showCamera]);

    useEffect(() => {
        // Trigger the search whenever searchId changes
        if (searchId) {
            handleScanClick();
        }
    }, [searchId]);

    const fetchData = async () => {
        let list = [];
        try {
            const querySnapshot = await getDocs(collection(db, 'assets'));
            querySnapshot.forEach((doc) => {
                list.push({ id: doc.id, ...doc.data() });
            });
            setData(list);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleScanClick = () => {
        // Filter the data array to find the matching result
        const result = data.filter(item => item.id === searchId);

        // Update the search result state
        setSearchResult(result);

        // Hide the camera
        setShowCamera(false);
    };

    const showCameraHandler = () => {
        // Show the camera when the "Scan" button is clicked
        setShowCamera(true);
    };

    // Inline style for the button
    const buttonStyle = {
        backgroundColor: '#172b4d', // Background color
        color: 'white', // Text color
        border: 'none', // Remove default border
        fontSize: '1rem', // Font size
        padding: '0.5rem 1rem', // Padding
    };

    return (
        <>
            <Header />
            <Container className="mt--7" fluid>
                <Row>
                    <Col xs="12" sm="12" md="12" lg="12" xl="12" className="mb-4">
                        <Card className="bg-default shadow">
                            <CardHeader className="bg-default border-0">
                                <h3 className="text-white mb-0">ASSET SCAN</h3>
                            </CardHeader>
                            <CardBody className="bg-secondary shadow">
                                <Form>
                                    <FormGroup>
                                        <InputGroup>
                                            {/* Add a video element for the QR scanner */}
                                            {showCamera && <video ref={videoRef} width="100%" height="auto"></video>}
                                            <Input
                                                type="text"
                                                name="text"
                                                id="exampleText"
                                                placeholder="Enter ID or Scan QR Code"
                                                value={searchId}
                                                onChange={(e) => setSearchId(e.target.value)}
                                            />
                                            <InputGroupAddon addonType="append">
                                                <Button style={buttonStyle} onClick={showCameraHandler}>
                                                    <FaCamera /> Scan
                                                </Button>
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </FormGroup>
                                </Form>
                                {/* Display search result */}
                                <ListGroup>
                                    {searchResult.map((item) => (
                                        <ListGroupItem key={item.id}>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h3 className="mb-1">{item.user.toUpperCase()}</h3>
                                                    <h5 className="mb-1">{item.department.toUpperCase()}</h5>
                                                    <small>Created: {item.timeStamp && item.timeStamp.toDate().toLocaleDateString()}</small>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="mt-3">
                                                    <strong>Equipment:</strong> {item.equipment}
                                                    <br />
                                                    <strong>Hostname:</strong> {item.hostname}
                                                    <br />
                                                    <strong>Location:</strong> {item.location}
                                                    <br />
                                                    <strong>Model:</strong> {item.model}
                                                    <br />
                                                    <strong>Serial Number:</strong> {item.serialNumber}
                                                    <br />
                                                    <strong>Tagging:</strong> {item.tagging}
                                                    <br />
                                                    <strong>Department:</strong> {item.department}
                                                </p>
                                            </div>
                                        </ListGroupItem>
                                    ))}
                                </ListGroup>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Scan;
