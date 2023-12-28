import './App.css';
import Header from "./component/Header/Header";
import {Button, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import {useFormik} from "formik";
import Form from "react-bootstrap/Form";
import * as Yup from 'yup';
import Swal from "sweetalert2";
import "./App.css"

const FormSchema = Yup.object().shape({
    fullName: Yup.string()
        .min(5, 'Tên phải lớn hơn 5 ký tự')
        .max(30, 'Tên phải ít hơn 30 ký tự!')
        .required('Bạn cần phải nhập tên'),
    age: Yup.string()
        .min(2, 'Bạn nhập tuổi không đúng')
        .max(3, 'Vui lòng kiểm tra lại tuổi')
        .required('Bạn cần phải nhập tuổi'),
    branch: Yup.string().required('Bạn cần phải chọn phòng ban'),
    salary: Yup.string()
        .min(7, 'Bạn cần phải nhập đúng mức lương')
        .max(10, 'Bạn cần phải nhập đúng mức lương')
        .required('Bạn cần phải nhập mức lương'),
    employeeCode: Yup.string()
        .min(5, 'Mã nhân viên bao gồm 5 ký tự (vd: FT025, FT027,...)')
        .max(5, 'Mã nhân viên bao gồm 5 ký tự (vd: FT025, FT027,...)')
        .required('Bạn cần phải nhập mã nhân viên'),
});

function App() {
    const [listUser, setListUser] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadPage, setLoadPage] = useState(false)
    const [create, setCreate] = useState(false)
    const [edit, setEdit] = useState(false)
    const [showDetail, setShowDetail] = useState(false)
    const [ageIndex, setAgeIndex] = useState("asc")
    const [userDetail, setUserDetail] = useState({
        fullName: '',
        employeeCode: '',
        age: "",
        salary: "",
        branch: "",
        id: 0
    })
    const [userEdit, setUserEdit] = useState({
        fullName: '',
        employeeCode: '',
        age: "",
        salary: "",
        branch: "",
        id: 0
    })


    useEffect(() => {
        setLoading(true)

        async function getAllCustomer() {
            const fetch = await axios.get("https://6582c12b02f747c8367a1e1a.mockapi.io/Employee")
            const listAPI = fetch.data
            setListUser(listAPI)
        }

        getAllCustomer().then(() => {
            setLoading(false)
        })

    }, [loadPage]);
    let listShow = []
    if (ageIndex === 'asc') {
        listShow = listUser.sort((a, b) => a.age - b.age);
    } else {
        listShow = listUser.sort((a, b) => b.age - a.age);
    }


    const handleDeleteItem = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Are you sure you want to delete this employee?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                async function deleteCustomer() {
                    await axios.delete("https://6582c12b02f747c8367a1e1a.mockapi.io/Employee/" + id)
                }

                deleteCustomer().then(() => {
                    setLoadPage(prevState => !prevState)
                    Swal.fire({
                        title: "Deleted!",
                        text: "Employee has been deleted.",
                        icon: "success"
                    });
                })
            }
        })

    }
    const handleClickCreate = () => {
        setCreate(prevState => !prevState)
    }

    const handleClickEdit = (user) => {
        formEdit.setValues(user)
        setEdit(true)
        console.log(user)
        console.log(userEdit)
    }
const formEdit = useFormik({
    initialValues: userEdit,
    validationSchema: FormSchema,
    onSubmit: values => {
        handleEditUser(values)
        console.log("hello")
        console.log(userEdit)
    }
});
    const handleEditUser = async (user) =>{
        await fetch(`https://6582c12b02f747c8367a1e1a.mockapi.io/Employee/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        }).then(() =>{
            setLoadPage(prevState => !prevState)
            setEdit(false)
            Swal.fire({
                title: "Update!",
                text: "Employee has been update.",
                icon: "success"
            });

        }).catch(()=>{
            Swal.fire({
                title: "Fail!",
                text: "Update error!",
                icon: "error"
            });
        })
    }
const formCreate = useFormik({
    initialValues: {
        fullName: '',
        employeeCode: '',
        age: "",
        salary: "",
        branch: "",
        id: 0
    },
    validationSchema: FormSchema,
    onSubmit: values => {
        handleCreateUser(values)
    }
});


const handleCreateUser = (data) => {
    async function createUser() {
        await axios.post("https://6582c12b02f747c8367a1e1a.mockapi.io/Employee", data)
    }

    createUser().then(() => {
        setCreate(false)
        setLoadPage(prevState => !prevState)
        Swal.fire({
            title: "Create!",
            text: "Employee has been create.",
            icon: "success"
        });
    }).catch(() => {
        Swal.fire({
            title: "Fail!",
            text: "Create error!",
            icon: "error"
        });
    })
}
const handleSelectAge = (event) => {
    setAgeIndex(event.target.value)
}
    return (
    <>
        <Header/>
        <div className={"container"}>
            <div className={"row"}>
                <div className={"col-12"}>
                    {showDetail ? (<div>
                        <h3>Employee Detail</h3>
                        <p>ID: {userDetail.id}</p>
                        <p>Employee Code: {userDetail.employeeCode}</p>
                        <p>FullNAME: {userDetail.fullName}</p>
                        <p>Salary: {userDetail.salary}</p>
                        <p>Age Code: {userDetail.age}</p>
                        <p>Branch: {userDetail.branch}</p>
                        <Button variant="outline-secondary" onClick={() => {
                            setShowDetail(false)
                        }}>Close</Button>{' '}
                    </div>) : ""}


                    {(create && !edit) ? (<div>
                        <Form onSubmit={formCreate.handleSubmit}>
                            <h3>Form Create Employee</h3>
                            <Form.Group className="mb-3" controlId="formBasisCode">
                                <Form.Label>Employee Code</Form.Label>
                                <Form.Control type="text" placeholder="Employee Code..."
                                              name="employeeCode"
                                              onChange={formCreate.handleChange}
                                              value={formCreate.values.employeeCode}/>
                                {formCreate.errors.employeeCode && formCreate.touched.employeeCode ? (
                                    <div style={{color: "red"}}>{formCreate.errors.employeeCode}</div>
                                ) : null}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicFullName">
                                <Form.Label>FullName</Form.Label>
                                <Form.Control type="text" placeholder="FullName..."
                                              name="fullName"
                                              onChange={formCreate.handleChange}
                                              value={formCreate.values.fullName}/>
                                {formCreate.errors.fullName && formCreate.touched.fullName ? (
                                    <div style={{color: "red"}}>{formCreate.errors.fullName}</div>
                                ) : null}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPasswordAge">
                                <Form.Label>Age</Form.Label>
                                <Form.Control type="number" placeholder="Age"
                                              name="age"
                                              onChange={formCreate.handleChange}
                                              value={formCreate.values.age}/>
                                {formCreate.errors.age && formCreate.touched.age ? (
                                    <div style={{color: "red"}}>{formCreate.errors.age}</div>
                                ) : null}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicSalary">
                                <Form.Label>Salary</Form.Label>
                                <Form.Control type="number" placeholder="Salary..."
                                              name="salary"
                                              onChange={formCreate.handleChange}
                                              value={formCreate.values.salary}/>
                                {formCreate.errors.salary && formCreate.touched.salary ? (
                                    <div style={{color: "red"}}>{formCreate.errors.salary}</div>
                                ) : null}
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Branch</Form.Label>
                                <Form.Select
                                    name="branch"
                                    onChange={formCreate.handleChange}
                                    value={formCreate.values.branch}>
                                    <option value={""}>----Select Branch----</option>
                                    <option value={"IT"}>IT</option>
                                    <option value={"QA"}>QA</option>
                                    <option value={"MA"}>MA</option>
                                </Form.Select>
                                {formCreate.errors.branch && formCreate.touched.branch ? (
                                    <div style={{color: "red"}}>{formCreate.errors.branch}</div>
                                ) : null}
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </div>) : ""}

                    {(!create && edit) ? (<div>
                        <Form onSubmit={formEdit.handleSubmit}>
                            <h3>Form Edit Employee</h3>
                            <Form.Group className="mb-3" controlId="formBasisCode">
                                <Form.Label>Employee Code</Form.Label>
                                <Form.Control type="text" placeholder="Employee Code..."
                                              name="employeeCode"
                                              onChange={formEdit.handleChange}
                                              value={formEdit.values.employeeCode}/>
                                {formEdit.errors.employeeCode && formEdit.touched.employeeCode ? (
                                    <div style={{color: "red"}}>{formEdit.errors.employeeCode}</div>
                                ) : null}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicFullName">
                                <Form.Label>FullName</Form.Label>
                                <Form.Control type="text" placeholder="FullName..."
                                              name="fullName"
                                              onChange={formEdit.handleChange}
                                              value={formEdit.values.fullName}/>
                                {formEdit.errors.fullName && formEdit.touched.fullName ? (
                                    <div style={{color: "red"}}>{formEdit.errors.fullName}</div>
                                ) : null}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPasswordAge">
                                <Form.Label>Age</Form.Label>
                                <Form.Control type="number" placeholder="Age"
                                              name="age"
                                              onChange={formEdit.handleChange}
                                              value={formEdit.values.age}/>
                                {formEdit.errors.age && formCreate.touched.age ? (
                                    <div style={{color: "red"}}>{formEdit.errors.age}</div>
                                ) : null}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicSalary">
                                <Form.Label>Salary</Form.Label>
                                <Form.Control type="number" placeholder="Salary..."
                                              name="salary"
                                              onChange={formEdit.handleChange}
                                              value={formEdit.values.salary}/>
                                {formEdit.errors.salary && formEdit.touched.salary ? (
                                    <div style={{color: "red"}}>{formEdit.errors.salary}</div>
                                ) : null}
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Branch</Form.Label>
                                <Form.Select
                                    name="branch"
                                    onChange={formEdit.handleChange}
                                    value={formEdit.values.branch}>
                                    <option value={""}>----Select Branch----</option>
                                    <option value={"IT"}>IT</option>
                                    <option value={"QA"}>QA</option>
                                    <option value={"MA"}>MA</option>
                                </Form.Select>
                                {formEdit.errors.branch && formEdit.touched.branch ? (
                                    <div style={{color: "red"}}>{formEdit.errors.branch}</div>
                                ) : null}
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                            <Button variant="secondary" type="button" style={{marginLeft: 10}} onClick={() => {
                                setEdit(false)
                            }}>
                                Cancel
                            </Button>
                        </Form>
                    </div>) : ""}

                    <div className={"d-flex justify-content-between my-2"}>
                        <h3>Employee Management</h3>
                        {(!edit && !create) ? (<Form.Select style={{height: 40, marginTop: 10, width: 300}}
                                                            aria-label="Default select example" onChange={(event) => {
                            handleSelectAge(event)
                        }}>
                            <option value="asc">Tuổi tăng dần</option>
                            <option value="desc">Tuổi giảm dần</option>
                        </Form.Select>) : ""}
                        {!edit ? (
                            <Button variant={create ? "outline-secondary" : "outline-primary"}
                                    onClick={handleClickCreate}>{create ? "Cancel Create" : "Create User"}</Button>
                        ) : ""}
                    </div>
                    {loading ? (<p>...Loading...</p>) : (
                        <Table striped bordered hover className={(edit || create || showDetail) ? "hide" : ""}>
                            <thead>
                            <tr>
                                <th>No.</th>
                                <th>Employee Code</th>
                                <th>FullName</th>
                                <th>Age</th>
                                <th>Salary</th>
                                <th>Branch</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {listShow.map((user, index) => (
                                <tr key={user.id}>
                                    <td>{index + 1}</td>
                                    <td>{user.employeeCode}</td>
                                    <td style={{cursor: "pointer"}} onClick={() => {
                                        setShowDetail(true)
                                        setUserDetail(user)
                                    }}>{user.fullName}</td>
                                    <td>{user.age}</td>
                                    <td>{user.salary}</td>
                                    <td>{user.branch}</td>
                                    <td>
                                        <div>
                                            <Button variant="secondary"
                                                    onClick={() => {
                                                        handleClickEdit(user)
                                                    }}>Edit</Button>{' '}
                                            <Button variant="danger"
                                                    onClick={() => {
                                                        handleDeleteItem(user.id)
                                                    }}>Delete</Button>{' '}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    )}
                </div>

            </div>

        </div>

    </>
)
}

export default App;
