CREATE OR REPLACE PACKAGE PENDUPM.PCKGASTOLIB  IS
/*
           ALERTAS PARA AUTORIZACION
                6: UMBRAL
                7: ETAPAS
                8: PAGO DOBLE
                9: JEFE INMEDIATO
                10: EMPRESA
                34: URGENTE
                44: EXCEDENTE COMPROBCION
                45: ETAPAS FINALES
                46: STATUS Y COLAS CREDITO

             TIPOS DE DESPLEGADOS TABLAS DE DETALLE EN AUTORIZACIONES
                *** APLICA PARA DETALLE DE CREDITOS
                       -- SI ES 6,  SON 3 VALIDADORES
                       -- 7,8,45,46 , SON 2 VALIDADORES
                *** APLICA PARA SOLICITUDES ( 1 - SIN JUSTIFICACION )  9
                       --  1 SOLO VALIDAROR
                *** APLICA PARA SOLICITUDES ( 2 - CON JUSTIFICACIONN ) 10,34,44
                      ---  SI ES 10,34  SOLO 1 VALIDADOR
                      ---  SI ES 44 SON 2 VALIDADORES

                OBTENER SU DESCRIPCION DESDE CTCATALOGOGASTOS


*/

 TYPE T_CURSOR IS REF CURSOR;

 CURSOR cuCamposAlerta ( xsAlerta   INTEGER) IS
      SELECT CASE WHEN xsAlerta = 6 THEN 'fcjustificacionumbral, fcusuumbral03,fcusuumbral04,fcusuumbral05, fcresumbral03,fcresumbral04,fcresumbral05'
                  WHEN xsAlerta = 7 THEN 'fcjustificaetapa, fcusuetapa01,fcusuetapa02, fcresetapa01,fcresetapa02'
                  WHEN xsAlerta = 8 THEN 'fcjustificapagodbl, fcusupgodbl01,fcusupgodbl02, fcrespgodbl01,fcrespgodbl02'
                  WHEN xsAlerta = 9 THEN ''||''''||''''||''' , fcusujfeinmed, fcresultjfeinmed'
                  WHEN xsAlerta = 10 THEN 'fcjustificaempresa, fcusuempresa, fcresempresa'
                  WHEN xsAlerta = 34 THEN 'fcjustificaurgente, fcusuurgente, fcresurgente'
                  WHEN xsAlerta = 44 THEN 'fcjustificaexcgasto, fcusuexcgasto01,fcusuexcgasto02, fcresexcgasto01,fcresexcgasto02'
                  WHEN xsAlerta = 45 THEN 'fcjustificetafinal, fcusuetafinal01,fcusuetafinal02, fcresetafinal01,fcresetafinal02'
                  WHEN xsAlerta = 46 THEN 'fcjustificaliq, fcusuliquidado01,fcusuliquidado02, fcresliq01,fcresliq01'
             END
        FROM DUAL;

  --- Obtiene las Alertas del Gastos - empleado  CABECERO
  PROCEDURE getAlarmaGasto (pnGasto          INTEGER,  /* numero de gasto */
                            pnUsuario        INTEGER,  /* Nuero de empleado */
                            salida        IN OUT T_CURSOR);

  --- Obtiene las Alertas del Gastos - empleado
  PROCEDURE getAlarmaGastoTipo (pnGasto          INTEGER,  /* numero de gasto */
                                pnTipo           INTEGER,  /* Nuero de Alerta */
                                pnUsuario        INTEGER,  /* Nuero de empleado */
                                salida        IN OUT T_CURSOR);

  FUNCTION queUsuarioEs (psNumEmpleado INTEGER) RETURN VARCHAR2 ;

  PROCEDURE setAutorizaResultado ( pnGasto          INTEGER,  /* numero de gasto */
                                   pnTipo           INTEGER,  /* Nuero de Alerta */
                                   pcCredito        VARCHAR2, /* NUMERO DECREDITO */
                                   pnConcepto       INTEGER,  /* numero de concepto */
                                   pnUsuario        INTEGER,  /* Nuero de empleado */
                                   psValor          VARCHAR2, /* Valor del Resultado */
                                   psFechaRegistro  VARCHAR2, /* Fecha Registro */
                                   psError   OUT    VARCHAR2);

  PROCEDURE setAutorizaComentario ( pnGasto          INTEGER,  /* numero de gasto */
                                   pnTipo           INTEGER,  /* Nuero de Alerta */
                                   pcCredito        VARCHAR2, /* NUMERO DECREDITO */
                                   pnConcepto       INTEGER,  /* numero de concepto */
                                   pnUsuario        INTEGER,  /* Nuero de empleado */
                                   psValor          VARCHAR2, /* Valor del comentario */
                                   psFechaRegistro  VARCHAR2, /* Fecha Registro */
                                   psError   OUT    VARCHAR2);

 PROCEDURE getCreaPdfAvaluo (salida        IN OUT T_CURSOR);

 PROCEDURE getExcelCuboGasto (salida        IN OUT T_CURSOR);

 PROCEDURE cargaAvaluosenLW;

END PCKGASTOLIB;
/

