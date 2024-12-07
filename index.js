import { neon } from '@neondatabase/serverless';
import express from 'express';
import { engine } from 'express-handlebars';
import methodOverride from 'method-override';

const sql = neon(
  'postgresql://neondb_owner:qGe4H3OiNUdF@ep-dawn-sunset-a5nj1xuj.us-east-2.aws.neon.tech/neondb?sslmode=require'
);

const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

//--------------------------- RUTAS ---------------------------------------//

app.get('/', (req, res) => {
  try {
    res.render('index');
  } catch (error) {
    console.error('Error al mostrar pagina, error');
  }
});

app.get('/arrendatario', (req, res) => {
  try {
    res.render('arrendatario');
  } catch (error) {
    console.error('Error al cargar los arrendatarios');
  }
});

app.get('/condominio', (req, res) => {
  try {
    res.render('condominio');
  } catch (error) {
    console.error('Error al cargar los condominios');
  }
});

app.get('/contrato', (req, res) => {
  try {
    res.render('contrato');
  } catch (error) {
    console.error('Error al cargar los contratos');
  }
});

app.get('/contratoclientes', (req, res) => {
  try {
    res.render('contratoclientes');
  } catch (error) {
    console.error('Error al cargar los contratos de los clientes');
  }
});

app.get('/edificio', (req, res) => {
  try {
    res.render('edificio');
  } catch (error) {
    console.error('Error al cargar los edificios');
  }
});

app.get('/empresas', (req, res) => {
  try {
    res.render('empresas');
  } catch (error) {
    console.error('Error al cargar las empresas');
  }
});

app.get('/holding', (req, res) => {
  try {
    res.render('holding');
  } catch (error) {
    console.error('Error al cargar los holdings');
  }
});

app.get('/propiedad', (req, res) => {
  try {
    res.render('propiedad');
  } catch (error) {
    console.error('Error al cargar las propiedades');
  }
});

//--------------------------- Agregar holding----------------------------//
app.post('/holding', async (req, res) => {
  const { nombre, rut } = req.body;
  try {
    const query = `INSERT INTO holding (nombre, rut) VALUES ($1, $2)`;
    await sql(query, [nombre, rut]);
    res.redirect('/holding'); //-------------> Abria que redireccionar a una pagina donde mostrase toda la tabla
  } catch (error) {
    console.error('Error al agregar el holding:', error);
  }
});

//---------------------------- Editar holding --------------------------//
app.post('/editholding', async (req, res) => {
  const { id, nombre, rut } = req.body;
  const query = 'UPDATE holding SET nombre = $1, rut = $2 WHERE idholding = $3';
  try {
    const result = await sql(query, [nombre, rut, id]);

    res.redirect('/holding'); //-------------> Abria que redireccionar a una pagina donde mostrase toda la tabla
  } catch (error) {
    console.error('Error al editar el holding:', error);
    res.status(500).send('No se pudo editar el holding');
  }
});

//---------------------------- Eliminar holding ------------------------//
app.post('/deleteholding', async (req, res) => {
  const { idholding } = req.body;
  try {
    await sql(`DELETE FROM holding WHERE idholding = $1`, [idholding]);
    res.redirect('/holding'); //-------------> Abria que redireccionar a una pagina donde mostrase toda la tabla
  } catch (error) {
    console.error('Error al eliminar el holding', error);
    res.status(500).send('No se pudo eliminar el holding');
  }
});

//--------------------------- Agregar empresa----------------------------//
app.post('/empresa', async (req, res) => {
  const { idholding, nombre, rut, banco } = req.body;
  try {
    const query = `INSERT INTO empresas (idholding, nombre, rut, banco) VALUES ($1, $2, $3, $4)`;
    await sql(query, [idholding, nombre, rut, banco]);
    res.redirect('/empresas'); //-------------> Abria que redireccionar a una pagina donde mostrase toda la tabla
  } catch (error) {
    console.error('Error al agregar la empresa', error);
  }
});

//---------------------------- Editar empresa --------------------------//
app.post('/editempresa', async (req, res) => {
  const { idempresa, idholding, nombre, rut, banco } = req.body;
  const query =
    'UPDATE empresas SET idholding =$1, nombre = $2, rut = $3, banco = $4 WHERE idempresa = $5';
  try {
    const result = await sql(query, [idholding, nombre, rut, banco, idempresa]);

    res.redirect('/empresas'); //-------------> Abria que redireccionar a una pagina donde mostrase toda la tabla
  } catch (error) {
    console.error('Error al editar la empresa:', error);
    res.status(500).send('No se pudo editar la empresa');
  }
});

//---------------------------- Eliminar empresa ------------------------//
app.post('/deleteempresa', async (req, res) => {
  const { idempresa } = req.body;
  try {
    await sql(`DELETE FROM empresas WHERE idempresa = $1`, [idempresa]);
    res.redirect('/empresas'); //-------------> Abria que redireccionar a una pagina donde mostrase toda la tabla
  } catch (error) {
    console.error('Error al eliminar la empresa', error);
    res.status(500).send('No se pudo eliminar la empresa');
  }
});

//--------------------------- Agregar contrato de cliente----------------------------//
app.post('/contratoclientes', async (req, res) => {
  const {
    idholding,
    nombre,
    fechainicio,
    fechatermino,
    monto,
    cantidadpropiedades,
  } = req.body;
  try {
    const query = `INSERT INTO contratoclientes (idholding, nombre, fecha_inicio, fecha_termino, monto, cantidad_propiedades) VALUES ($1, $2, $3, $4, $5, $6)`;
    await sql(query, [
      idholding,
      nombre,
      fechainicio,
      fechatermino,
      monto,
      cantidadpropiedades,
    ]);
    res.redirect('/contratoclientes'); //-------------> Abria que redireccionar a una pagina donde mostrase toda la tabla
  } catch (error) {
    console.error('Error al agregar el contrato del cliente', error);
  }
});

//---------------------------- Editar contrato de clientes --------------------------//
app.post('/editcontratoclientes', async (req, res) => {
  const {
    idholding,
    nombre,
    fechainicio,
    fechatermino,
    monto,
    cantidadpropiedades,
    idcliente,
  } = req.body;
  const query =
    'UPDATE contratoclientes SET idholding =$1, nombre = $2, fecha_inicio = $3, fecha_termino = $4, monto = $5, cantidad_propiedades= $6 WHERE idcliente = $7';
  try {
    const result = await sql(query, [
      idholding,
      nombre,
      fechainicio,
      fechatermino,
      monto,
      cantidadpropiedades,
      idcliente,
    ]);

    res.redirect('/contratoclientes'); //-------------> Abria que redireccionar a una pagina donde mostrase toda la tabla
  } catch (error) {
    console.error('Error al editar el contrato del cliente:', error);
    res.status(500).send('No se pudo editar el contrato del cliente');
  }
});

//---------------------------- Eliminar contrato clientes ------------------------//
app.post('/deletecontratoclientes', async (req, res) => {
  const { idcliente } = req.body;
  try {
    await sql(`DELETE FROM contratoclientes WHERE idcliente = $1`, [idcliente]);
    res.redirect('/contratoclientes'); //-------------> Abria que redireccionar a una pagina donde mostrase toda la tabla
  } catch (error) {
    console.error('Error al eliminar el contrato del cliente', error);
    res.status(500).send('No se pudo eliminar el contrato del cliente');
  }
});

//--------------------------- Agregar condominio----------------------------//
app.post('/condominio', async (req, res) => {
  const { idempresa, nombre, cantidadpropietarios } = req.body;
  try {
    const query = `INSERT INTO condominio (idempresa, nombre, cantidad_propietarios) VALUES ($1, $2, $3)`;
    await sql(query, [idempresa, nombre, cantidadpropietarios]);
    res.redirect('/condominio'); //-------------> Abria que redireccionar a una pagina donde mostrase toda la tabla
  } catch (error) {
    console.error('Error al agregar el condominio', error);
  }
});

//---------------------------- Editar condominio --------------------------//
app.post('/editcondominio', async (req, res) => {
  const { idcondominio, idempresa, nombre, cantidadpropietarios } = req.body;
  const query =
    'UPDATE condominio SET idempresa = $1, nombre = $2, cantidad_propietarios = $3 WHERE idcondominio = $4';
  try {
    const result = await sql(query, [
      idempresa,
      nombre,
      cantidadpropietarios,
      idcondominio,
    ]);

    res.redirect('/holding'); //-------------> Abria que redireccionar a una pagina donde mostrase toda la tabla
  } catch (error) {
    console.error('Error al editar el condominio:', error);
    res.status(500).send('No se pudo editar el condominio');
  }
});

//---------------------------- Eliminar empresa ------------------------//
app.post('/deletecondominio', async (req, res) => {
  const { idcondominio } = req.body;
  try {
    await sql(`DELETE FROM condominio WHERE idcondominio = $1`, [idcondominio]);
    res.redirect('/condominio'); //-------------> Abria que redireccionar a una pagina donde mostrase toda la tabla
  } catch (error) {
    console.error('Error al eliminar el condominio', error);
    res.status(500).send('No se pudo eliminar el condominio');
  }
});

//--------------------------- Agregar edificio----------------------------//
app.post('/edificio', async (req, res) => {
  const { idcondominio, direccion, comuna, nombre, tipoedificio } = req.body;
  try {
    const query = `INSERT INTO edificio (idcondominio, direccion, comuna, nombre, tipoedificio) VALUES ($1, $2, $3, $4, $5)`;
    await sql(query, [idcondominio, direccion, comuna, nombre, tipoedificio]);
    res.redirect('/edificio'); //-------------> Abria que redireccionar a una pagina donde mostrase toda la tabla
  } catch (error) {
    console.error('Error al agregar el edificio', error);
  }
});

//--------------------------- Editar edificio----------------------------//
app.post('/editedificio', async (req, res) => {
  const { idedificio, idcondominio, direccion, comuna, nombre, tipoedificio } =
    req.body;
  try {
    const query = `UPDATE edificio SET idcondominio = $1, direccion = $2, comuna = $3, nombre =$4, tipoedificio= $5 WHERE idedificio = $6`;
    await sql(query, [
      idcondominio,
      direccion,
      comuna,
      nombre,
      tipoedificio,
      idedificio,
    ]);
    res.redirect('/edificio'); //-------------> Abria que redireccionar a una pagina donde mostrase toda la tabla
  } catch (error) {
    console.error('Error al agregar el edificio', error);
  }
});

//---------------------------- Eliminar edificio ------------------------//
app.post('/deleteedificio', async (req, res) => {
  const { idedificio } = req.body;
  try {
    await sql(`DELETE FROM edificio WHERE idedificio = $1`, [idedificio]);
    res.redirect('/edificio'); //-------------> Abria que redireccionar a una pagina donde mostrase toda la tabla
  } catch (error) {
    console.error('Error al eliminar el edificio', error);
    res.status(500).send('No se pudo eliminar el edificio');
  }
});

//--------------------------- Agregar propiedad----------------------------//
app.post('/propiedad', async (req, res) => {
  const { idedificio, idcliente, tipo, numeropropiedad } = req.body;
  try {
    const query = `INSERT INTO propiedad (idedificio , idcliente, tipo , numero_propiedad ) VALUES ($1, $2, $3, $4)`;
    await sql(query, [idedificio, idcliente, tipo, numeropropiedad]);
    res.redirect('/propiedad'); //-------------> Abria que redireccionar a una pagina donde mostrase toda la tabla
  } catch (error) {
    console.error('Error al agregar la propiedad', error);
  }
});

//---------------------------- Editar propiedad --------------------------//
app.post('/editpropiedad', async (req, res) => {
  const { idpropiedad, idedificio, idcliente, tipo, numeropropiedad } =
    req.body;
  const query =
    'UPDATE propiedad SET idedificio = $1, idcliente = $2, tipo = $3, numero_propiedad = $4 WHERE idPropiedad = $5';
  try {
    const result = await sql(query, [
      idedificio,
      idcliente,
      tipo,
      numeropropiedad,
      idpropiedad,
    ]);

    res.redirect('/propiedad'); //-------------> Abria que redireccionar a una pagina donde mostrase toda la tabla
  } catch (error) {
    console.error('Error al editar la propiedad:', error);
    res.status(500).send('No se pudo editar la propiedad');
  }
});

//---------------------------- Eliminar propiedad ------------------------//
app.post('/deletepropiedad', async (req, res) => {
  const { idpropiedad } = req.body;
  try {
    await sql(`DELETE FROM propiedad WHERE idpropiedad = $1`, [idpropiedad]);
    res.redirect('/propiedad'); //-------------> Abria que redireccionar a una pagina donde mostrase toda la tabla
  } catch (error) {
    console.error('Error al eliminar la propiedad', error);
    res.status(500).send('No se pudo eliminar la propiedad');
  }
});

//--------------------------- Agregar arrendatario----------------------------//
app.post('/arrendatario', async (req, res) => {
  const { idpropiedad, nombre, rut, telefono, correo, direccion } = req.body;
  try {
    const query = `INSERT INTO arrendatario (idpropiedad, nombre, rut, telefono, correo, direccion  ) VALUES ($1, $2, $3, $4, $5, $6)`;
    await sql(query, [idpropiedad, nombre, rut, telefono, correo, direccion]);
    res.redirect('/arrendatario'); //-------------> Abria que redireccionar a una pagina donde mostrase toda la tabla
  } catch (error) {
    console.error('Error al agregar al arrendatario', error);
  }
});

//---------------------------- Editar arrendatario--------------------------//
app.post('/editarrendatario', async (req, res) => {
  const {
    idarrendatario,
    idpropiedad,
    nombre,
    rut,
    telefono,
    correo,
    direccion,
  } = req.body;
  const query =
    'UPDATE arrendatario SET idpropiedad = $1, nombre = $2, rut = $3, telefono = $4, correo= $5, direccion= $6 WHERE idarrendatario = $7';
  try {
    const result = await sql(query, [
      idpropiedad,
      nombre,
      rut,
      telefono,
      correo,
      direccion,
      idarrendatario,
    ]);

    res.redirect('/arrendatario'); //-------------> Abria que redireccionar a una pagina donde mostrase toda la tabla
  } catch (error) {
    console.error('Error al editar al arredatario:', error);
    res.status(500).send('No se pudo editar al arredatario');
  }
});

//---------------------------- Eliminar arrendatario ------------------------//
app.post('/deletearrendatario', async (req, res) => {
  const { idarrendatario } = req.body;
  try {
    await sql(`DELETE FROM arrendatario WHERE idarrendatario = $1`, [
      idarrendatario,
    ]);
    res.redirect('/arrendatario'); //-------------> Abria que redireccionar a una pagina donde mostrase toda la tabla
  } catch (error) {
    console.error('Error al eliminar al arrendatario', error);
    res.status(500).send('No se pudo eliminar al arredatario');
  }
});

//--------------------------- Agregar contrato----------------------------//
app.post('/contrato', async (req, res) => {
  const {
    idarrendatario,
    fecha_inicio,
    fecha_termino,
    monto,
    propiedadArrendada,
    gastosComunes,
  } = req.body;
  try {
    const query = `INSERT INTO contratos (    
      idArrendatario ,
      fecha_inicio ,
      fecha_termino ,
      monto ,
      propiedadArrendada  ,
      gastosComunes ) VALUES ($1, $2, $3, $4, $5, $6)`;
    await sql(query, [
      idarrendatario,
      fecha_inicio,
      fecha_termino,
      monto,
      propiedadArrendada,
      gastosComunes,
    ]);
    res.redirect('/contratos'); //-------------> Abria que redireccionar a una pagina donde mostrase toda la tabla
  } catch (error) {
    console.error('Error al agregar el contrato', error);
  }
});

//---------------------------- Editar contrato--------------------------//
app.post('/editcontrato', async (req, res) => {
  const {
    idcontrato,
    idarrendatario,
    fecha_inicio,
    fecha_termino,
    monto,
    propiedadArrendada,
    gastosComunes,
  } = req.body;
  const query =
    'UPDATE contratos SET idarrendatario = $1, fecha_inicio = $2, fecha_termino = $3, monto = $4, propiedadArrendada= $5, gastosComunes = $6 WHERE idcontrato = $7';
  try {
    const result = await sql(query, [
      idarrendatario,
      fecha_inicio,
      fecha_termino,
      monto,
      propiedadArrendada,
      gastosComunes,
      idcontrato,
    ]);

    res.redirect('/contrato'); //-------------> Abria que redireccionar a una pagina donde mostrase toda la tabla
  } catch (error) {
    console.error('Error al editar el contrato:', error);
    res.status(500).send('No se pudo editar el contrato');
  }
});

//---------------------------- Eliminar contrato ------------------------//
app.post('/deletecontrato', async (req, res) => {
  const { idcontrato } = req.body;
  try {
    await sql(`DELETE FROM contratos WHERE idcontrato = $1`, [idcontrato]);
    res.redirect('/contrato'); //-------------> Abria que redireccionar a una pagina donde mostrase toda la tabla
  } catch (error) {
    console.error('Error al eliminar el contrato', error);
    res.status(500).send('No se pudo eliminar el contrato');
  }
});

//---------------------------- Consulta: Contratos con los clientes ------------------------//
app.get('/contratos-clientes', async (req, res) => {
  const query = 'SELECT * FROM ContratoClientes';
  try {
      const contratosclientes = await sql(query);
      res.render('consultas/contratos-clientes', { contratosclientes });
  } catch (error) {
      console.error('Error al obtener los contratos con clientes:', error);
      res.status(500).json({ error: 'No se pudieron obtener los contratos con clientes' });
  }
});


//------------------- Consulta: Cantidad de propiedades por cliente ------------------------//
app.get('/cantidad-propiedades-cliente', async (req, res) => {
  const query = `
      SELECT c.nombre AS Cliente, COUNT(p.idPropiedad) AS Total_Propiedades
      FROM Contratoclientes c
      LEFT JOIN Propiedad p ON c.idCliente = p.idCliente
      GROUP BY c.idCliente, c.nombre
  `;
  try {
      const cantidadpropiedades = await sql(query);
      res.render('consultas/cantidad-propiedades', { cantidadpropiedades });
  } catch (error) {
      console.error('Error al obtener cantidad de propiedades por cliente:', error);
      res.status(500).json({ error: 'No se pudo obtener la cantidad de propiedades por cliente' });
  }
});


//--------------- Consulta: Condominio en donde se encuentra la propiedad --------------------//
app.get('/condominio-por-propiedad', async (req, res) => {
  const query = `
      SELECT DISTINCT Contratoclientes.nombre AS Cliente, Condominio.nombre AS Condominio, Propiedad.idPropiedad, Propiedad.tipo AS Tipo_Propiedad, Propiedad.numero_propiedad AS Numero_Propiedad
      FROM Contratoclientes
      JOIN Empresas ON Contratoclientes.idHolding = Empresas.idHolding
      JOIN Condominio ON Empresas.idEmpresa = Condominio.idEmpresa
      JOIN Edificio ON Condominio.idCondominio = Edificio.idCondominio
      JOIN Propiedad ON Edificio.idEdificio = Propiedad.idEdificio;
  `;
  try {
      const condominiopropiedad = await sql(query);
      res.render('consultas/condominio-propiedad', { condominiopropiedad });
  } catch (error) {
      console.error('Error al obtener condominio por propiedad:', error);
      res.status(500).json({ error: 'No se pudo obtener el condominio por propiedad' });
  }
});

//--------------- Consulta: Tipo de propiedad del Cliente ------------------------//
app.get('/tipo-propiedad-por-cliente', async (req, res) => {
  const query = `
      SELECT c.nombre AS Cliente, p.tipo AS Tipo_Propiedad, p.numero_propiedad AS Numero_Propiedad, p.idCliente
      FROM Contratoclientes c
      JOIN Propiedad p ON c.idCliente = p.idCliente
      ORDER BY p.idCliente, p.idPropiedad
  `;
  try {
      const tipopropiedad = await sql(query);
      res.render('consultas/tipo-propiedad', { tipopropiedad });
  } catch (error) {
      console.error('Error al obtener el tipo de propiedad por cliente', error);
      res.status(500).json({ error: 'No se pudo obtener el tipo de propiedad por cliente' });
  }
});

//--------------- Consulta: Banco del Cliente ------------------------//
app.get('/banco-por-cliente', async (req, res) => {
  const query = `
      SELECT c.nombre AS Cliente, e.banco AS Banco
      FROM Contratoclientes c
      JOIN Empresas e ON c.idHolding = e.idHolding
  `;
  try {
      const bancocliente = await sql(query);
      res.render('consultas/banco-cliente', { bancocliente });
  } catch (error) {
      console.error('Error al obtener el banco del cliente', error);
      res.status(500).json({ error: 'No se pudo obtener el banco del cliente' });
  }
});

//---------- Consulta: Fecha de inicio y termino de contrato con Cliente ---------------------//
app.get('/fechas-contrato-cliente', async (req, res) => {
  const query = 'SELECT nombre AS Cliente, fecha_inicio AS Fecha_Inicio, fecha_termino AS Fecha_Termino FROM Contratoclientes';
  try {
      const fechascontratoclientes = await sql(query);
      res.render('consultas/fechas-contrato', { fechascontratoclientes });
  } catch (error) {
      console.error('Error al obtener las fechas de contrato del cliente', error);
      res.status(500).json({ error: 'No se pudo obtener las fechas de contrato del cliente' });
  }
});

//------------- Consulta: Contrato de los clientes con arrendatarios ------------------------//
app.get('/contratos-arrendatarios', async (req, res) => {
  const query = `
      SELECT c.nombre AS Cliente, a.nombre AS Arrendatario, co.fecha_inicio, co.fecha_termino, co.monto
      FROM Contratoclientes c
      JOIN Propiedad p ON c.idCliente = p.idCliente
      JOIN Arrendatario a ON p.idPropiedad = a.idPropiedad
      JOIN Contratos co ON a.idArrendatario = co.idArrendatario
  `;
  try {
      const contratoarrendatarios = await sql(query);
      res.render('consultas/contratos-arrendatarios', { contratoarrendatarios });
  } catch (error) {
      console.error('Error al obtener contratos de clientes con arrendatarios:', error);
      res.status(500).json({ error: 'No se pudo obtener los contratos de clientes con arrendatarios' });
  }
});

//---------- Consulta: Nombre, RUT, y monto de la renta de los arrendatarios --------------//
app.get('/info-arrendatarios', async (req, res) => {
  const query = `
      SELECT a.nombre AS Nombre_Arrendatario, a.rut AS RUT_Arrendatario, co.monto AS Monto_Arriendo
      FROM Arrendatario a
      JOIN Contratos co ON a.idArrendatario = co.idArrendatario
  `;
  try {
      const infoarrendatarios = await sql(query);
      res.render('consultas/info-arrendatarios', { infoarrendatarios });
  } catch (error) {
      console.error('Error al obtener renta de los arrendatarios', error);
      res.status(500).json({ error: 'No se pudo obtener la renta de los arrendatarios' });
  }
});

//------------- Consulta: Direccion de la propiedad ------------------------//
app.get('/direccion-propiedad', async (req, res) => {
  const query = `
      SELECT p.numero_propiedad, e.direccion
      FROM Propiedad p
      JOIN Edificio e ON p.idEdificio = e.idEdificio
  `;
  try {
      const direccionpropiedad = await sql(query);
      res.render('consultas/direccion-propiedad', { direccionpropiedad });
  } catch (error) {
      console.error('Error al obtener la dirección de la propiedad', error);
      res.status(500).json({ error: 'No se pudo obtener la dirección de la propiedad' });
  }
});

//ver toda la tabla Holding
app.get('/verholdings', async (req, res) => {
  const query = 'SELECT * FROM Holding';
  try {
      const verholdings = await sql(query);
      res.render('consultas/verholdings', { verholdings });
  } catch (error) {
      console.error('Error al obtener los holdings:', error);
      res.status(500).json({ error: 'No se pudieron obtener los datos de la tabla Holding' });
  }
});

//ver toda la tabla Holding
app.get('/verempresas', async (req, res) => {
  const query = 'SELECT * FROM Empresas'; 
  try {
      const verempresas = await sql(query);  
      res.render('consultas/verempresas', { verempresas });
  } catch (error) {
      console.error('Error al obtener las empresas:', error);
      res.status(500).json({ error: 'No se pudieron obtener los datos de la tabla Empresas' });
  }
});

//ver toda la tabla condominios
app.get('/vercondominios', async (req, res) => {
  const query = 'SELECT * FROM Condominio';  
  try {
      const vercondominios = await sql(query);
      res.render('consultas/vercondominios', { vercondominios }); 
  } catch (error) {
      console.error('Error al obtener los condominios:', error);
      res.status(500).json({ error: 'No se pudieron obtener los datos de la tabla Condominios' });
  }
});

//ver toda la tabla edificios
app.get('/veredificios', async (req, res) => {
  const query = 'SELECT * FROM Edificio'; 
  try {
      const veredificios = await sql(query);
      res.render('consultas/veredificios', { veredificios }); 
  } catch (error) {
      console.error('Error al obtener los edificios:', error);
      res.status(500).json({ error: 'No se pudieron obtener los datos de la tabla Edificios' });
  }
});

//ver toda la tabla arrendatarios
app.get('/verarrendatarios', async (req, res) => {
  const query = 'SELECT * FROM Arrendatario';  
  try {
      const verarrendatarios = await sql(query);
      res.render('consultas/verarrendatarios', { verarrendatarios }); 
  } catch (error) {
      console.error('Error al obtener los arrendatarios:', error);
      res.status(500).json({ error: 'No se pudieron obtener los datos de la tabla Arrendatarios' });
  }
});

//ver toda la tabla propiedades
app.get('/verpropiedades', async (req, res) => {
  const query = 'SELECT * FROM Propiedad';  
  try {
      const verpropiedades = await sql(query);
      res.render('consultas/verpropiedades', { verpropiedades });  
  } catch (error) {
      console.error('Error al obtener las propiedades:', error);
      res.status(500).json({ error: 'No se pudieron obtener los datos de la tabla Propiedades' });
  }
});

//Conocer si la propiedad está siendo arrendada
app.get('/propiedadarrendada', async (req,res) => {
  try {
    const query = 'SELECT P.idPropiedad, P.tipo, P.numero_propiedad, C.propiedadArrendada FROM Propiedad P LEFT JOIN Contratos C ON P.idPropiedad = C.idPropiedad;';
    
    const propiedadesarrendadas = await sql(query);
    console.log('Consulta:', propiedadesarrendadas);
    res.render('consultas/propiedadarrendada', { propiedadesarrendadas });

  } catch (error) {
      console.error('Error ejecutando la consulta:', error);
      res.status(500).send('Error en el servidor');
    }
});

//--- Consulta cuantas personas hay en una propiedad---FUNCIONA TOTALMENTE!!1!---//

app.get('/personasenpropiedad', async (req, res) => {
  const query = 'SELECT P.idPropiedad, COUNT(A.idArrendatario) AS Cantidad_Hospedados FROM Propiedad P LEFT JOIN Arrendatario a ON P.idPropiedad = A.idPropiedad GROUP BY P.idPropiedad;';
  try {
    const personasenpropiedad = await sql(query);
    res.render('consultas/personasenpropiedad', { personasenpropiedad });
  } catch (error) {
    console.error('Error ejecutando la consulta:', error);
    res.status(500).send('Error en el servidor');
  }
});

//--- Consulta tipo de edificio ---FUNCIONA TOTALMENTE!!1!---//

app.get('/tipodeedificio', async (req, res) => {
  const query = 'SELECT P.idPropiedad, E.tipoEdificio FROM Propiedad P JOIN Edificio E ON P.idEdificio = E.idEdificio;';
  try {
    const tipoedificio = await sql(query);
    res.render('consultas/tipodeedificio', { tipoedificio });
  } catch (error) {
    console.error('Error ejecutando la consulta:', error);
    res.status(500).send('Error en el servidor');
  }
});

//--- Consulta gastos comunes --FUNCIONA TOTALMENTE!!1!---//

app.get('/gastoscomunes', async (req, res) => {
  const query =
    'SELECT P.idPropiedad, C.gastosComunes FROM Propiedad P JOIN Contratos C ON P.idPropiedad = C.idPropiedad WHERE C.propiedadArrendada = TRUE;';
  try {
    const gastoscomunes = await sql(query);
    res.render('consultas/gastoscomunes', { gastoscomunes });
  } catch (error) {
    console.error('Error ejecutando la consulta:', error);
    res.status(500).send('Error en el servidor');
  }
});

//--- Consulta renta arrendatario ---FUNCIONA TOTALMENTE!!1!---//

app.get('/rentaarrendatario', async (req, res) => {
  const query =
    'SELECT P.idPropiedad, A.idArrendatario, C.monto AS renta FROM Propiedad P JOIN Arrendatario A ON P.idPropiedad = A.idPropiedad JOIN Contratos C ON A.idArrendatario = C.idArrendatario;';
  try {
    const rentaarrendatario = await sql(query);
    res.render('consultas/rentaarrendatario', { rentaarrendatario });
  } catch (error) {
    console.error('Error ejecutando la consulta:', error);
    res.status(500).send('Error en el servidor');
  }
});

//--- Consulta renta total edificio ---FUNCIONA TOTALMENTE!!1!---//

app.get('/rentatotaledificio', async (req, res) => {
  const query =
    'SELECT E.idEdificio, SUM(C.monto) AS Renta_Total_Edificio FROM Edificio E JOIN Propiedad P ON E.idEdificio = P.idEdificio JOIN Arrendatario A ON P.idPropiedad = A.idPropiedad JOIN Contratos C ON A.idArrendatario = C.idArrendatario GROUP BY E.idEdificio;';
  try {
    const rentatotal = await sql(query);
    res.render('consultas/rentatotaledificio', { rentatotal });
  } catch (error) {
    console.error('Error ejecutando la consulta:', error);
    res.status(500).send('Error en el servidor');
  }
});

const port = 3000;
app.listen(3000, () => console.log('tuki'));
