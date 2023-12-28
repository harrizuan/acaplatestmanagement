import React, { useEffect, useState, useRef } from "react";
import DataTable from "react-data-table-component";
import {
  Card,
  CardHeader,
  Container,
  Row,
  Button,
  Tooltip,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { FaEdit, FaTrashAlt, FaQrcode } from "react-icons/fa"; // Import icons
import Header from "components/Headers/Header.js";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { TailSpin } from "react-loader-spinner"; // Import the loader
import QRCode from "qrcode.react"; // Import QRCode component

const Asset = () => {
  const [data, setData] = useState([]);
  const [tooltipOpen, setTooltipOpen] = useState({}); // State to manage tooltip
  const [loading, setLoading] = useState(true); // State to manage loading

  const [departmentFilter, setDepartmentFilter] = useState("");
  const [equipmentFilter, setEquipmentFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [qrValue, setQRValue] = useState("");

  const filterRows = (rows) => {
    return rows.filter((row) => {
      return (
        row.department.toLowerCase().includes(departmentFilter.toLowerCase()) &&
        row.equipment.toLowerCase().includes(equipmentFilter.toLowerCase()) &&
        row.user.toLowerCase().includes(userFilter.toLowerCase()) &&
        row.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    });
  };

  // Function to toggle tooltip
  const toggleTooltip = (id) => {
    setTooltipOpen({ ...tooltipOpen, [id]: !tooltipOpen[id] });
  };

  const columns = [
    {
      name: "Department",
      selector: (row) => row.department,
      sortable: true,
    },
    {
      name: "Equipment",
      selector: (row) => row.equipment,
      sortable: true,
    },
    {
      name: "Model",
      selector: (row) => row.model,
      sortable: true,
    },
    {
      name: "Serial Number",
      selector: (row) => row.serialNumber,
      sortable: true,
    },
    {
      name: "Tagging",
      selector: (row) => row.tagging,
      sortable: true,
    },
    {
      name: "Hostname",
      selector: (row) => row.hostname,
      sortable: true,
    },
    {
      name: "User",
      selector: (row) => row.user,
      sortable: true,
    },
    {
      name: "Timestamp",
      selector: (row) => row.timeStamp.toDate().toLocaleString(), // Assuming timeStamp is a Firestore Timestamp
      sortable: true,
    },
    {
      name: "Location",
      selector: (row) => row.location,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <FaEdit
            id={`edit-${row.id}`}
            style={{ cursor: "pointer" }}
            onClick={() => handleEdit(row.id)}
          />
          <Tooltip
            isOpen={tooltipOpen[`edit-${row.id}`]}
            target={`edit-${row.id}`}
            toggle={() => toggleTooltip(`edit-${row.id}`)}
          >
            Edit
          </Tooltip>{" "}
          <FaTrashAlt
            id={`delete-${row.id}`}
            style={{ cursor: "pointer" }}
            onClick={() => handleDelete(row.id)}
          />
          <Tooltip
            isOpen={tooltipOpen[`delete-${row.id}`]}
            target={`delete-${row.id}`}
            toggle={() => toggleTooltip(`delete-${row.id}`)}
          >
            Delete
          </Tooltip>{" "}
          <FaQrcode
            id={`qrcode-${row.id}`}
            style={{ cursor: "pointer" }}
            onClick={() => handleQRCode(row.id)}
          />
          <Tooltip
            isOpen={tooltipOpen[`qrcode-${row.id}`]}
            target={`qrcode-${row.id}`}
            toggle={() => toggleTooltip(`qrcode-${row.id}`)}
          >
            QR Code
          </Tooltip>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const fetchData = async () => {
    let list = [];
    try {
      const querySnapshot = await getDocs(collection(db, "assets"));
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setData(list);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (id) => {
    console.log("Edit", id);
    // Implementation for Edit
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "assets", id));
      setData(data.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleQRCode = (id) => {
    setQRValue(id);
    setModalOpen(true);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const customStyles = {
    headCells: {
      style: {
        fontWeight: "bold", // Make header bold
        color: "#000", // Set the color of the header text
      },
    },
  };

  const generateQRWithID = () => {
    return (
      <div>
        <QRCode value={qrValue} size={128} />
        <p>{qrValue}</p>
      </div>
    );
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-default shadow">
              <CardHeader className="bg-transparent border-0">
                <h3 className="text-white mb-0">ASSET INVENTORY</h3>
              </CardHeader>
              {/* <Form style={{ padding: '0.5rem' }}>
                                <Row form>
                                    <Col md={2}>
                                        <FormGroup>
                                            <Label for="departmentFilter" className="mb-0">Dept.</Label>
                                            <Input
                                                bsSize="sm"
                                                type="text"
                                                name="departmentFilter"
                                                id="departmentFilter"
                                                placeholder="Department"
                                                value={departmentFilter}
                                                onChange={(e) => setDepartmentFilter(e.target.value)}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={2}>
                                        <FormGroup>
                                            <Label for="equipmentFilter" className="mb-0">Equip.</Label>
                                            <Input
                                                bsSize="sm"
                                                type="text"
                                                name="equipmentFilter"
                                                id="equipmentFilter"
                                                placeholder="Equipment"
                                                value={equipmentFilter}
                                                onChange={(e) => setEquipmentFilter(e.target.value)}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={2}>
                                        <FormGroup>
                                            <Label for="userFilter" className="mb-0">User</Label>
                                            <Input
                                                bsSize="sm"
                                                type="text"
                                                name="userFilter"
                                                id="userFilter"
                                                placeholder="User"
                                                value={userFilter}
                                                onChange={(e) => setUserFilter(e.target.value)}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={2}>
                                        <FormGroup>
                                            <Label for="locationFilter" className="mb-0">Loc.</Label>
                                            <Input
                                                bsSize="sm"
                                                type="text"
                                                name="locationFilter"
                                                id="locationFilter"
                                                placeholder="Location"
                                                value={locationFilter}
                                                onChange={(e) => setLocationFilter(e.target.value)}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Form> */}
              {loading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "300px",
                  }}
                >
                  <TailSpin color="#00BFFF" height={50} width={50} />
                </div>
              ) : (
                <div>
                  <DataTable
                    columns={columns}
                    data={filterRows(data)}
                    customStyles={customStyles}
                    defaultSortFieldId={1}
                    pagination
                    highlightOnHover
                  />
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>QR Code</ModalHeader>
        <ModalBody>{generateQRWithID()}</ModalBody>
      </Modal>
    </>
  );
};

export default Asset;
