
--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.19
-- Dumped by pg_dump version 9.5.19

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: panoramas; Type: TABLE; Schema: public; Owner: gisuser
--

CREATE TABLE public.panoramas (
    id integer NOT NULL,
    the_geom public.geometry(Geometry,4326),
    authorised integer DEFAULT 0,
    username integer DEFAULT 0,
    "timestamp" integer,
    userid character varying(255),
    ele double precision DEFAULT 0,
    tiltcorrection double precision DEFAULT 0,
    rollcorrection double precision DEFAULT 0,
    pancorrection double precision DEFAULT 0,
    poseheadingdegrees double precision DEFAULT 0
);


ALTER TABLE public.panoramas OWNER TO gisuser;

--
-- Name: panoramas_id_seq; Type: SEQUENCE; Schema: public; Owner: gisuser
--

CREATE SEQUENCE public.panoramas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.panoramas_id_seq OWNER TO gisuser;

--
-- Name: panoramas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gisuser
--

ALTER SEQUENCE public.panoramas_id_seq OWNED BY public.panoramas.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: gisuser
--

ALTER TABLE ONLY public.panoramas ALTER COLUMN id SET DEFAULT nextval('public.panoramas_id_seq'::regclass);


--
-- Data for Name: panoramas; Type: TABLE DATA; Schema: public; Owner: gisuser
--

COPY public.panoramas (id, the_geom, authorised, username, "timestamp", userid, ele, tiltcorrection, rollcorrection, pancorrection, poseheadingdegrees) FROM stdin;
1	0101000020E61000001BB7F571F895F6BF1DC9E53FA4774940	1	0	\N	1	58	0	0	120	45
2	0101000020E61000002F0000808895F6BF59725D1398774940	1	0	\N	1	56	0	0	153	22.5
3	0101000020E61000007C0000C03995F6BFD8659DAC89774940	1	0	\N	1	55	-20	0	56	112.5
\.


--
-- Name: panoramas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gisuser
--


--
-- PostgreSQL database dump complete
--
--
-- Name: panoramas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gisuser
--


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.19
-- Dumped by pg_dump version 9.5.19

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: sequence_panos; Type: TABLE; Schema: public; Owner: gisuser
--

CREATE TABLE public.sequence_panos (
    id integer NOT NULL,
    sequenceid integer,
    panoid integer
);


ALTER TABLE public.sequence_panos OWNER TO gisuser;

--
-- Name: sequence_panos_id_seq; Type: SEQUENCE; Schema: public; Owner: gisuser
--

CREATE SEQUENCE public.sequence_panos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sequence_panos_id_seq OWNER TO gisuser;

--
-- Name: sequence_panos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gisuser
--

ALTER SEQUENCE public.sequence_panos_id_seq OWNED BY public.sequence_panos.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: gisuser
--

ALTER TABLE ONLY public.sequence_panos ALTER COLUMN id SET DEFAULT nextval('public.sequence_panos_id_seq'::regclass);


--
-- Data for Name: sequence_panos; Type: TABLE DATA; Schema: public; Owner: gisuser
--

COPY public.sequence_panos (id, sequenceid, panoid) FROM stdin;
1	1	1
2	1	2
3	1	3
\.


--
-- Name: sequence_panos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gisuser
--


--
-- PostgreSQL database dump complete
--

