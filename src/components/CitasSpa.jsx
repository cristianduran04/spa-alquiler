import React, { useState, useEffect } from "react";
import "../styles/CitasSpa.css";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc
} from "firebase/firestore";

const CitasSpa = () => {
  const [citas, setCitas] = useState([]);
  const [form, setForm] = useState({
    servicio: "",
    precio: "",
    fecha: "",
    hora: "",
    clienta: "",
    estado: "pendiente"
  });
  const [editId, setEditId] = useState(null);

  const citasRef = collection(db, "citasSpa");

  // Función para obtener las citas desde Firestore
  const obtenerCitas = async () => {
    const snapshot = await getDocs(citasRef);
    const datos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCitas(datos);
  };

  useEffect(() => {
    obtenerCitas();
  }, []);

  // Función para guardar o actualizar una cita
  const guardarCita = async () => {
    // Validar que todos los campos estén completos
    if (!form.servicio || !form.precio || !form.fecha || !form.hora || !form.clienta) {
      alert("Por favor completa todos los campos");
      return;
    }

    if (editId) {
      const citaDoc = doc(db, "citasSpa", editId);
      await updateDoc(citaDoc, form);
      setEditId(null);
    } else {
      await addDoc(citasRef, form);
    }

    setForm({ servicio: "", precio: "", fecha: "", hora: "", clienta: "", estado: "pendiente" });
    obtenerCitas();
  };

  // Función para editar una cita
  const editarCita = (cita) => {
    setForm(cita);
    setEditId(cita.id);
  };

  // Función para marcar una cita como terminada
  const terminarCita = async (id) => {
    const citaDoc = doc(db, "citasSpa", id);
    await updateDoc(citaDoc, { estado: "terminada" });
    obtenerCitas();
  };

  // Función para eliminar una cita
  const eliminarCita = async (id) => {
    const citaDoc = doc(db, "citasSpa", id);
    await deleteDoc(citaDoc);
    obtenerCitas();
  };

  return (
    <div className="container">
      <h2>Agenda VenusNails</h2>

      {/* Formulario para ingresar las citas */}
      <div className="input-group">
        <input 
          placeholder="Servicio (separado por comas)" 
          value={form.servicio} 
          onChange={e => setForm({...form, servicio: e.target.value})} 
        />
        <input 
          placeholder="Precio" 
          value={form.precio} 
          onChange={e => setForm({...form, precio: e.target.value})} 
        />
        <input 
          type="date" 
          value={form.fecha} 
          onChange={e => setForm({...form, fecha: e.target.value})} 
        />
        <input 
          type="time" 
          value={form.hora} 
          onChange={e => setForm({...form, hora: e.target.value})} 
        />
        <input 
          placeholder="Nombre de la clienta" 
          value={form.clienta} 
          onChange={e => setForm({...form, clienta: e.target.value})} 
        />
        <button onClick={guardarCita} className="btn-primary">
          {editId ? "Actualizar Cita" : "Guardar Cita"}
        </button>
      </div>

      <h3>Citas Agendadas</h3>

      {/* Lista de citas */}
      <ul className="list">
        {citas.map(cita => (
          <li key={cita.id} className="list-item">
            <div>
              <p><strong>Fecha:</strong> {cita.fecha} <strong>Hora:</strong> {cita.hora}</p>
              <p><strong>Clienta:</strong> {cita.clienta}</p>
              <p><strong>Servicios:</strong> {cita.servicio.split(",").join(", ")}</p> {/* Mostrar servicios separados por coma */}
              <p><strong>Precio:</strong> ${cita.precio}</p>
              <p><strong>Estado:</strong> <span className={cita.estado === "terminada" ? "estado-terminada" : "estado-pendiente"}>{cita.estado}</span></p>
            </div>

            {/* Botones de acción */}
           
<div className="button-group">
  <button className="btn-edit" onClick={() => editarCita(cita)}>
    <i className="fas fa-edit"></i> Editar
  </button>
  {cita.estado !== "terminada" && (
    <button className="btn-done" onClick={() => terminarCita(cita.id)}>
      <i className="fas fa-check"></i> Terminar
    </button>
  )}
  <button className="btn-delete" onClick={() => eliminarCita(cita.id)}>
    <i className="fas fa-trash"></i> Eliminar
  </button>
</div>


          </li>
        ))}
      </ul>
    </div>
  );
};

export default CitasSpa;



