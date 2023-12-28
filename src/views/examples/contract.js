import React from "react";
import Header from "components/Headers/Header";
import { Col, Card, CardHeader } from "reactstrap";

const Contract = () => {
  return (
    <>
      <Header />
      <Col className="order-xl-1" xl="12">
        <Card className="bg-default shadow">
          <CardHeader className="bg-transparent border-0">
            <h3 className="text-white mb-0">Contract</h3>
          </CardHeader>
        </Card>
      </Col>
    </>
  );
};

export default Contract;
