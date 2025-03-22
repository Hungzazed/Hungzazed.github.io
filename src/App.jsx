import { useReducer, useState, useEffect, useRef, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const studentReducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return [...state, action.payload];
    case "DELETE":
      return state.filter((sv) => sv.id !== action.payload);
    case "UPDATE":
      return state.map((sv) =>
        sv.id === action.payload.id ? action.payload : sv
      );
    case "SET":
      return [...state, ...action.payload]
    default:
      return state;
  }
};

const App = () => {
  const [students, dispatch] = useReducer(studentReducer, []);
  const [name, setName] = useState("");
  const [score1, setScore1] = useState("");
  const [score2, setScore2] = useState("");
  const [score3, setScore3] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState(null);
  const inputRef = useRef();

  useEffect(() => {
    const storedStudents = JSON.parse(localStorage.getItem("students"));
    if (storedStudents) {
      dispatch({ type: "SET", payload: storedStudents });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  
  const calculateAverage = (s1, s2, s3) => {
    return ((parseFloat(s1) + parseFloat(s2) + parseFloat(s3)) / 3).toFixed(2);
  };

  const handleAddStudent = () => {
    if (!name.trim() || !score1 || !score2 || !score3) return;

    if (score1 < 0 || score1 > 10 || score2 < 0 || score2 > 10 || score3 < 0 || score3 > 10) {
      showAlert("Điểm phải nằm trong khoảng từ 0 đến 10", "danger");
      return;
    }

    const newStudent = {
      id: editingId || students.length + 1,
      name,
      score1: parseFloat(score1),
      score2: parseFloat(score2),
      score3: parseFloat(score3),
      dtb: calculateAverage(score1, score2, score3),
    };

    if (editingId) {
      dispatch({ type: "UPDATE", payload: newStudent });
      setEditingId(null);
    } else {
      dispatch({ type: "ADD", payload: newStudent });
    }

    setName("");
    setScore1("");
    setScore2("");
    setScore3("");
    inputRef.current.focus();
  };

  const handleDeleteStudent = (id) => {
    dispatch({ type: "DELETE", payload: id });
  };

  const handleEditStudent = (id) => {
    const student = students.find((sv) => sv.id === id);
    setName(student.name);
    setScore1(student.score1);
    setScore2(student.score2);
    setScore3(student.score3);
    setEditingId(id);
    inputRef.current.focus();
  };

  const calTotalDTB = useMemo(() => {
    if (students.length === 0) return 0;
    return (students.reduce((total, sv) => total + parseFloat(sv.dtb), 0) / students.length).toFixed(2);
  }, [students]);

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 2000);
  };

  return (
    <div className="container mt-4">
      {alert && (
        <div className={`alert alert-${alert.type} text-center`}>
          {alert.message}
        </div>
      )}
      <h1 className="text-center mb-4">Quản Lý Sinh Viên</h1>
      <div className="card p-3 mb-4">
        <div className="row g-2">
          <div className="col-md-3">
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              placeholder="Nhập tên sinh viên"
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              value={score1}
              onChange={(e) => setScore1(e.target.value)}
              className="form-control"
              placeholder="Điểm 1"
              min="0"
              max="10"
              step="0.1"
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              value={score2}
              onChange={(e) => setScore2(e.target.value)}
              className="form-control"
              placeholder="Điểm 2"
              min="0"
              max="10"
              step="0.1"
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              value={score3}
              onChange={(e) => setScore3(e.target.value)}
              className="form-control"
              placeholder="Điểm 3"
              min="0"
              max="10"
              step="0.1"
            />
          </div>
          <div className="col-md-3">
            <button onClick={handleAddStudent} className="btn btn-primary w-100">
              {editingId ? "Cập Nhật" : "Thêm Sinh Viên"}
            </button>
          </div>
        </div>
      </div>
      <div>
        <h3>Tổng điểm trung bình: <span className="text-primary">{calTotalDTB}</span></h3>
      </div>
      <h2 className="text-center mb-3">Danh Sách Sinh Viên</h2>
      <table className="table table-bordered text-center">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Tên Sinh Viên</th>
            <th>Điểm 1</th>
            <th>Điểm 2</th>
            <th>Điểm 3</th>
            <th>Điểm Trung Bình</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {students.map((sv, index) => (
            <tr key={sv.id}>
              <td>{index + 1}</td>
              <td>{sv.name}</td>
              <td>{sv.score1}</td>
              <td>{sv.score2}</td>
              <td>{sv.score3}</td>
              <td>{sv.dtb}</td>
              <td>
                <button onClick={() => handleEditStudent(sv.id)} className="btn btn-warning btn-sm me-2">
                  Sửa
                </button>
                <button onClick={() => handleDeleteStudent(sv.id)} className="btn btn-danger btn-sm">
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
