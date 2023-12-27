import './App.css';
import Header from "./component/Header/Header";
import Selects from "./component/Content/Select/Selects";
import {Button, Table} from "react-bootstrap";
import Search from "./component/Content/Search/Search";
import {useEffect, useState} from "react";
import axios from "axios";
import {useFormik} from "formik";
import Form from "react-bootstrap/Form";
import * as Yup from 'yup';


const FormSchema = Yup.object().shape({
    fullName: Yup.string()
        .min(5, 'Too Short!')
        .max(30, 'Too Long!')
        .required('Required'),
    age: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    gender: Yup.string().required('Required'),
    address: Yup.string().required('Required'),
});
function App() {
    const [listUser, setListUser] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadPage, setLoadPage] = useState(false)
    const [create, setCreate] = useState(false)
    const [edit, setEdit] = useState(false)
    const [userTemp, setUserTemp] = useState({
        fullName: '',
        age: "",
        address: "",
        gender: ""
    })

    useEffect(() => {
        setLoading(true)
        async function getAllCustomer(){
            const fetch = await axios.get("https://6582c12b02f747c8367a1e1a.mockapi.io/customer")
            const listAPI = fetch.data
            setListUser(listAPI)
        }
        getAllCustomer().then(()=>{
            setLoading(false)
        })

    }, [loadPage]);
    const handleDeleteItem = (id) =>{
        async function deleteCustomer(){
            await axios.delete("https://6582c12b02f747c8367a1e1a.mockapi.io/customer/" + id)
        }
        deleteCustomer().then(() =>{
            setLoadPage(prevState => !prevState)
            alert("Xoá thành công")
        })
    }
    const handleClickCreate = ()=>{
        setCreate(true)
    }
    const handleClickEdit = (user) =>{
        setEdit(true)
        setUserTemp(user)
        console.log(user)
    }
    const formCreate = useFormik({
        initialValues: userTemp,
        validationSchema: FormSchema,
        onSubmit: values => {
            if(!edit && create){
                handleCreateUser(values)
            }else if(edit && !create){
                // handleEditUser(user)
            }else (alert("Lỗi set trạng thái"))
        },
    });
    const handleCreateUser = (data) =>{
        async function createUser(){
            await axios.post("https://6582c12b02f747c8367a1e1a.mockapi.io/customer", data)
        }
        createUser().then(()=>{
            setCreate(false)
            setLoadPage(prevState => !prevState)
            alert("Create Successfully!")
        }).catch(()=>{
            alert("Create Fail!")
        })
        setUserTemp({
            fullName: '',
            age: "",
            address: "",
            gender: ""
        })
        console.log(userTemp)
    }
  return (
    <>
      <Header/>
      <div className={"container"}>
          <div className={"row"}>
              <div className={"col-2"} style={{borderRight: "solid", borderWidth: 0.5, borderColor: "lightgray"}}>
                  <h4>Gender</h4>
                  <div>
                      <Selects/>
                  </div>
              </div>
              <div className={"col-10"}>
                  {(create||edit)? (<div>
                      <Form onSubmit={formCreate.handleSubmit}>
                          <h3>Form Create User</h3>
                          <Form.Group className="mb-3" controlId="formBasicFullName">
                              <Form.Label>FullName</Form.Label>
                              <Form.Control type="text" placeholder="FullName..."
                                            name="fullName"
                                            onChange={formCreate.handleChange}
                                            value={formCreate.values.fullName} />
                              {formCreate.errors.fullName && formCreate.touched.fullName ? (
                                  <div style={{color:"red"}}>{formCreate.errors.fullName}</div>
                              ) : null}
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="formBasicPasswordAge">
                              <Form.Label>Age</Form.Label>
                              <Form.Control type="number" placeholder="Age"
                                            name="age"
                                            onChange={formCreate.handleChange}
                                            value={formCreate.values.age}/>
                              {formCreate.errors.age && formCreate.touched.age ? (
                                  <div style={{color:"red"}}>{formCreate.errors.age}</div>
                              ) : null}
                          </Form.Group>
                          <Form.Group className="mb-3" controlId="formBasicAddress">
                              <Form.Label>Address</Form.Label>
                              <Form.Control type="text" placeholder="Address..."
                                            name="address"
                                            onChange={formCreate.handleChange}
                                            value={formCreate.values.address}/>
                              {formCreate.errors.address && formCreate.touched.address ? (
                                  <div style={{color:"red"}}>{formCreate.errors.address}</div>
                              ) : null}
                          </Form.Group>
                          <Form.Group className="mb-3">
                              <Form.Label>Gender</Form.Label>
                              <Form.Select
                                  name="gender"
                                  onChange={formCreate.handleChange}
                                  value={formCreate.values.gender}>
                                  <option value={""}>----Select Gender----</option>
                                  <option value={"MALE"}>Male</option>
                                  <option value={"FEMALE"}>Female</option>
                                  <option value={"OTHER"}>Other</option>
                              </Form.Select>
                              {formCreate.errors.gender && formCreate.touched.gender ? (
                                  <div style={{color:"red"}}>{formCreate.errors.gender}</div>
                              ) : null}
                          </Form.Group>
                          <Button variant="primary" type="submit">
                              Submit
                          </Button>
                      </Form>
                  </div>) : ("")}
                  <div className={"d-flex justify-content-between my-2"}>
                  <h3>List Customer</h3>
                      <Search/>
                      {!edit ? (
                          <Button variant={create?"outline-secondary" : "outline-primary"} onClick={handleClickCreate}>{create?"Cancel Create" : "Create User"}</Button>
                      ) : ""}
                  </div>
                  {loading ? (<p>...Loading...</p>) : (
                      <Table striped bordered hover>
                          <thead>
                          <tr>
                              <th>No.</th>
                              <th>FullName</th>
                              <th>Age</th>
                              <th>Gender</th>
                              <th>Address</th>
                              <th>Action</th>
                          </tr>
                          </thead>
                          <tbody>
                          {listUser.map((user, index) => (
                              <tr key={user.id}>
                                  <td>{index+1}</td>
                                  <td>{user.fullName}</td>
                                  <td>{user.age}</td>
                                  <td>{user.gender}</td>
                                  <td>{user.address}</td>
                                  <td>
                                      <div>
                                          <Button variant="secondary" className={edit? "disabled" : ""} onClick={()=>{
                                              handleClickEdit(user)
                                          }}>Edit</Button>{' '}
                                          <Button variant="danger" className={edit? "disabled" : ""} onClick={()=>{
                                              handleDeleteItem(user.id)
                                          }}>Delete</Button>{' '}
                                      </div>
                                  </td>
                              </tr>
                          ))}
                          </tbody>
                      </Table>
                  ) }
              </div>

          </div>

      </div>

    </>
  );
}

export default App;
