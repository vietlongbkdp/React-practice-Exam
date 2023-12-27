import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function Forms() {
    return (
        <Form>
            <h3>Form Create User</h3>
            <Form.Group className="mb-3" controlId="formBasicFullName">
                <Form.Label>FullName</Form.Label>
                <Form.Control type="text" placeholder="FullName..."/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPasswordAge">
                <Form.Label>Age</Form.Label>
                <Form.Control type="number" placeholder="Age" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" placeholder="Address..." />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Select>
                    <option value={""}>----Select Gender----</option>
                    <option value={"MALE"}>Male</option>
                    <option value={"FEMALE"}>Female</option>
                    <option value={"OTHER"}>Other</option>
                </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    );
}
