using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Data.SqlClient;
using System.Web;



namespace aspcrud1.Models
{
    public class mPersonas
    {
        SqlClass miSqlClass = new SqlClass();

        public int Id { get; set; }
        public string Nombre { get; set; }
        public string ApellidoP { get; set; }
        public string ApellidoM { get; set; }
        public string Direccion { get; set; }
        public string Telefono { get; set; }
        public int Estatus { get; set; }

        List<mPersonas> lsPersonas = new List<mPersonas>();

        public List<mPersonas> obtenerPersonas(int Estatus)
        { //obtiene todas las personas de la bd

            DataTable dtTemp = new DataTable();
            dtTemp.CaseSensitive = true;
            miSqlClass.conectar();

            if (Estatus == 2)
            {

                var a = miSqlClass.SqlConsulta("SELECT Id, CONCAT(Nombres, ' ',ApellidoP,' ',ApellidoM) Nombre, Telefono, Direccion, Estatus" +
                            "  FROM Persona_Jorge ", ref dtTemp);
            }
            else
            {

                var a = miSqlClass.SqlConsulta("SELECT Id, CONCAT(Nombres, ' ',ApellidoP,' ',ApellidoM) Nombre, Telefono, Direccion, Estatus" +
                            "  FROM Persona_Jorge WHERE Estauts ='" + Estatus + "'", ref dtTemp);
            }

            List<mPersonas> miLista = new List<mPersonas>();

            miLista = (from rw in dtTemp.AsEnumerable()
                       select new mPersonas
                       {
                           Id = Convert.ToInt32(rw["Id"]),
                           Nombre = Convert.ToString(rw["Nombre"]),
                           Telefono = Convert.ToString(rw["Telefono"]),
                           Direccion = Convert.ToString(rw["Direccion"]),
                           Estatus = Convert.ToInt32(rw["Estatus"])
                       }).ToList();
            return miLista;
        }

        public bool insertPersona(mPersonas newPersona)
        {
            miSqlClass.conectar();

            miSqlClass.SqlConsulta("INSERT INTO Persona_Jorge (Nombres, ApellidoP, ApellidoM, Direccion, Telefono) VALUES ('" + newPersona.Nombre + "','" + newPersona.ApellidoP + "','" + newPersona.ApellidoM + "','" + newPersona.Direccion + "','" + newPersona.Telefono + "')");

            return true;
        }

        public List<mPersonas> obtenerPersonasBusqueda(string Busqueda)
        { //obtiene todas las personas de la bd

            DataTable dtTemp = new DataTable();
            dtTemp.CaseSensitive = true;
            miSqlClass.conectar();

            var a = miSqlClass.SqlConsulta("SELECT Id, CONCAT(Nombres, ' ',ApellidoP,' ',ApellidoM) Nombre, Telefono, Direccion, Estatus" +
                           "  FROM Persona_Jorge" +
                           " WHERE Nombres LIKE '%" + Busqueda + "%'" +
                           " OR ApellidoP LIKE '%" + Busqueda + "%'" +
                           " OR ApellidoM LIKE '%" + Busqueda + "%'", ref dtTemp);

            List<mPersonas> miLista = new List<mPersonas>();

            miLista = (from rw in dtTemp.AsEnumerable()
                       select new mPersonas
                       {
                           Id = Convert.ToInt32(rw["Id"]),
                           Nombre = Convert.ToString(rw["Nombre"]),
                           Telefono = Convert.ToString(rw["Telefono"]),
                           Direccion = Convert.ToString(rw["Direccion"]),
                           Estatus = Convert.ToInt32(rw["Estatus"])
                       }).ToList();
            return miLista;
        }

        public List<mPersonas> leerPersona(int Id)
        {
            DataTable dtTemp = new DataTable();
            dtTemp.CaseSensitive = true;

            miSqlClass.conectar();
            var a = miSqlClass.SqlConsulta("SELECT * FROM Persona_Jorge Where Id = " + Id, ref dtTemp);

            List<mPersonas> miLista = new List<mPersonas>();

            miLista = (from rw in dtTemp.AsEnumerable()
                       select new mPersonas
                       {
                           Id = Convert.ToInt32(rw["Id"]),
                           Nombre = Convert.ToString(rw["Nombres"]),
                           ApellidoP = Convert.ToString(rw["ApellidoP"]),
                           ApellidoM = Convert.ToString(rw["ApellidoM"]),
                           Direccion = Convert.ToString(rw["Direccion"]),
                           Telefono = Convert.ToString(rw["Telefono"]),
                           Estatus = Convert.ToInt32(rw["Estatus"])
                       }).ToList();
            return miLista;
        }

        public bool restaurarPersona(int Id)
        {
            miSqlClass.conectar();

            miSqlClass.SqlConsulta("UPDATE Persona_Jorge SET Estatus = 1 WHERE Id = " + Id);

            return true;
        }

        public bool EditarPersona(mPersonas editPersona, int Id)
        {
            miSqlClass.conectar();

            miSqlClass.SqlConsulta("UPDATE Persona_Jorge SET Nombres = '" + editPersona.Nombre + "', ApellidoP = '" + editPersona.ApellidoP + "', ApellidoM = '" + editPersona.ApellidoM + "', Direccion = '" + editPersona.Direccion + "', Telefono = '" + editPersona.Telefono + "' WHERE Id = " + Id);

            return true;
        }

        public bool eliminarPersona(int Id)
        {
            miSqlClass.conectar();

            miSqlClass.SqlConsulta("UPDATE Persona_Jorge SET Estatus = 0 WHERE Id = " + Id);

            return true;
        }
    }

}