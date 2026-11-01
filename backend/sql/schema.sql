CREATE DATABASE nps_db_ap;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS npsecom(
  orderid VARCHAR NOT NULL,
  name VARCHAR,
  email VARCHAR,
  date TIMESTAMP WITH TIME ZONE,
  store INT,
  delivery VARCHAR,
  coupon VARCHAR,
  nps INT,
  detmacro VARCHAR,
  det_atendimento VARCHAR,
  det_pagamento VARCHAR,
  det_siteapp VARCHAR,
  det_retirada VARCHAR,
  det_entrega VARCHAR,
  det_preco VARCHAR,
  det_produto VARCHAR,
  det_justif VARCHAR,
  tags VARCHAR,
  neut_prom_macro VARCHAR,
  neut_prom_justif VARCHAR,
  PRIMARY KEY (orderId)
);


CREATE TABLE IF NOT EXISTS npsloja (
    orderid VARCHAR PRIMARY KEY,
    name VARCHAR,
    email VARCHAR,
    date TIMESTAMPTZ,
    store INTEGER,
    delivery VARCHAR,
    coupon VARCHAR,
    nps INTEGER,
    detmacro VARCHAR,
    det_tempesperacaixa VARCHAR,
    det_atendimento VARCHAR,
    det_variedadequalidade VARCHAR,
    det_appclube VARCHAR,
    det_ambienteloja VARCHAR,
    det_preco VARCHAR,
    det_estacionamento VARCHAR,
    det_justif VARCHAR,
    tags VARCHAR,
    neut_prom_macro VARCHAR,
    neut_prom_justif VARCHAR
);
