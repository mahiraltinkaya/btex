--
-- PostgreSQL database dump
--

\restrict rP8NTaSOvZ0XRJ84ijQ6odXbDFFTJMfU7soKTz3wHuixTOwHiRfQZSuv7FNeH1B

-- Dumped from database version 15.17 (Homebrew)
-- Dumped by pg_dump version 15.17 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE IF EXISTS db_ticket;
--
-- Name: db_ticket; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE db_ticket WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';


\unrestrict rP8NTaSOvZ0XRJ84ijQ6odXbDFFTJMfU7soKTz3wHuixTOwHiRfQZSuv7FNeH1B
\connect db_ticket
\restrict rP8NTaSOvZ0XRJ84ijQ6odXbDFFTJMfU7soKTz3wHuixTOwHiRfQZSuv7FNeH1B

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- Name: EventType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EventType" AS ENUM (
    'CONCERT',
    'FESTIVAL',
    'CONFERENCE',
    'OTHER'
);


--
-- Name: TicketStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TicketStatus" AS ENUM (
    'OPEN',
    'RESERVED',
    'SOLD'
);


--
-- Name: TransactionStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TransactionStatus" AS ENUM (
    'PENDING',
    'COMPLETED'
);


--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."UserRole" AS ENUM (
    'CUSTOMER',
    'ADMIN'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Events" (
    id text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    capacity integer DEFAULT 50 NOT NULL,
    amount double precision NOT NULL,
    type public."EventType" NOT NULL,
    "eventDate" timestamp(3) without time zone,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Tickets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Tickets" (
    id text NOT NULL,
    "ticketCode" text NOT NULL,
    "seatNumber" integer NOT NULL,
    status public."TicketStatus" DEFAULT 'OPEN'::public."TicketStatus" NOT NULL,
    "eventId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" text
);


--
-- Name: Transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Transactions" (
    id text NOT NULL,
    amount double precision NOT NULL,
    "eventId" text NOT NULL,
    "ticketId" text NOT NULL,
    "userId" text NOT NULL,
    status public."TransactionStatus" DEFAULT 'PENDING'::public."TransactionStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Users" (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "firstName" text,
    "lastName" text,
    role public."UserRole" DEFAULT 'CUSTOMER'::public."UserRole" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: event_monitor; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.event_monitor AS
SELECT
    NULL::text AS id,
    NULL::text AS name,
    NULL::public."EventType" AS type,
    NULL::integer AS capacity,
    NULL::double precision AS amount,
    NULL::boolean AS is_active,
    NULL::bigint AS open_tickets,
    NULL::bigint AS reserved_tickets,
    NULL::bigint AS sold_tickets,
    NULL::double precision AS total_revenue,
    NULL::numeric AS occupancy_rate,
    NULL::timestamp(3) without time zone AS created_at;


--
-- Data for Name: Events; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Events" (id, name, description, capacity, amount, type, "eventDate", "isActive", "createdAt", "updatedAt") FROM stdin;
0ddee452-153e-4847-8453-e1f3ceed40b0	Summer Beats Festival	Experience the best of Summer Beats Festival. An unforgettable event featuring top-tier performances and electrifying energy.	10	150	FESTIVAL	\N	t	2026-03-14 11:25:46.483	2026-03-14 11:25:46.483
369f52f3-2ccb-414b-a5a8-571d5fd4eebd	Rock Arena Night	Experience the best of Rock Arena Night. An unforgettable event featuring top-tier rock bands and live performances.	10	85	CONCERT	\N	t	2026-03-14 11:25:46.539	2026-03-14 11:25:46.539
cf88d98c-bf2d-4489-aae5-aea73fabf402	Tech Innovators 2026	Experience the best of Tech Innovators 2026. Cutting-edge technology conference with world-class speakers.	10	200	CONFERENCE	\N	t	2026-03-14 11:25:46.546	2026-03-14 11:25:46.546
9e8f10c3-ae04-4d40-96ba-ec64baf4dfff	Jazz Under the Stars	Experience the best of Jazz Under the Stars. A magical evening of jazz music under the open sky.	10	120	CONCERT	\N	t	2026-03-14 11:25:46.552	2026-03-14 11:25:46.552
f21badc3-aa6a-4a7a-87b2-36992286fa09	Comedy Carnival	Experience the best of Comedy Carnival. A night full of laughter with top comedians from around the world.	10	45	OTHER	\N	t	2026-03-14 11:25:46.556	2026-03-14 11:25:46.556
8917b030-0f4a-457e-b848-aad7d4d7711f	Electronic Dreams	Experience the best of Electronic Dreams. The ultimate electronic music festival with world-renowned DJs.	10	95	FESTIVAL	\N	t	2026-03-14 11:25:46.562	2026-03-14 11:25:46.562
\.


--
-- Data for Name: Tickets; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Tickets" (id, "ticketCode", "seatNumber", status, "eventId", "createdAt", "updatedAt", "userId") FROM stdin;
a2fdcbf2-8945-40dd-b3e3-d4a50249e863	0ddee452-153e-4847-8453-e1f3ceed40b0-1	1	OPEN	0ddee452-153e-4847-8453-e1f3ceed40b0	2026-03-14 11:25:46.492	2026-03-14 11:25:46.492	\N
3184f288-7ebe-435e-a0ea-f3632baff728	0ddee452-153e-4847-8453-e1f3ceed40b0-2	2	OPEN	0ddee452-153e-4847-8453-e1f3ceed40b0	2026-03-14 11:25:46.492	2026-03-14 11:25:46.492	\N
36a1244d-4f2f-4fcc-aeb3-dcc3687193cd	0ddee452-153e-4847-8453-e1f3ceed40b0-3	3	OPEN	0ddee452-153e-4847-8453-e1f3ceed40b0	2026-03-14 11:25:46.492	2026-03-14 11:25:46.492	\N
1bc1be32-70ff-48d3-8f54-cc65cd1c76a5	0ddee452-153e-4847-8453-e1f3ceed40b0-4	4	OPEN	0ddee452-153e-4847-8453-e1f3ceed40b0	2026-03-14 11:25:46.492	2026-03-14 11:25:46.492	\N
90b946ff-0880-4550-965b-c5d3a14b64aa	0ddee452-153e-4847-8453-e1f3ceed40b0-5	5	OPEN	0ddee452-153e-4847-8453-e1f3ceed40b0	2026-03-14 11:25:46.492	2026-03-14 11:25:46.492	\N
b84be7de-0570-408f-b7fa-fce29af1b25f	0ddee452-153e-4847-8453-e1f3ceed40b0-6	6	OPEN	0ddee452-153e-4847-8453-e1f3ceed40b0	2026-03-14 11:25:46.492	2026-03-14 11:25:46.492	\N
4e2e258a-b64d-49d6-85dd-9cea8b6c44bc	0ddee452-153e-4847-8453-e1f3ceed40b0-7	7	OPEN	0ddee452-153e-4847-8453-e1f3ceed40b0	2026-03-14 11:25:46.492	2026-03-14 11:25:46.492	\N
b3689a92-b6bf-4937-b70a-fd91b8cc474d	0ddee452-153e-4847-8453-e1f3ceed40b0-8	8	OPEN	0ddee452-153e-4847-8453-e1f3ceed40b0	2026-03-14 11:25:46.492	2026-03-14 11:25:46.492	\N
236dd211-d17c-4b9a-8251-fc89e68d707d	0ddee452-153e-4847-8453-e1f3ceed40b0-9	9	OPEN	0ddee452-153e-4847-8453-e1f3ceed40b0	2026-03-14 11:25:46.492	2026-03-14 11:25:46.492	\N
9c109b3d-6ac5-4656-a123-27e19d896a93	0ddee452-153e-4847-8453-e1f3ceed40b0-10	10	OPEN	0ddee452-153e-4847-8453-e1f3ceed40b0	2026-03-14 11:25:46.492	2026-03-14 11:25:46.492	\N
2945a15b-8069-477a-a1dc-1f5103a5397e	369f52f3-2ccb-414b-a5a8-571d5fd4eebd-1	1	OPEN	369f52f3-2ccb-414b-a5a8-571d5fd4eebd	2026-03-14 11:25:46.541	2026-03-14 11:25:46.541	\N
f60da724-3159-432e-a1ae-db988610eea2	369f52f3-2ccb-414b-a5a8-571d5fd4eebd-2	2	OPEN	369f52f3-2ccb-414b-a5a8-571d5fd4eebd	2026-03-14 11:25:46.541	2026-03-14 11:25:46.541	\N
6b1c3e8a-22b1-46ef-8a2d-ef645620e200	369f52f3-2ccb-414b-a5a8-571d5fd4eebd-3	3	OPEN	369f52f3-2ccb-414b-a5a8-571d5fd4eebd	2026-03-14 11:25:46.541	2026-03-14 11:25:46.541	\N
15d283c8-d241-4866-8baa-f14919b177ba	369f52f3-2ccb-414b-a5a8-571d5fd4eebd-4	4	OPEN	369f52f3-2ccb-414b-a5a8-571d5fd4eebd	2026-03-14 11:25:46.541	2026-03-14 11:25:46.541	\N
c0ac19fe-5f72-4b2d-a10b-976b7043251e	369f52f3-2ccb-414b-a5a8-571d5fd4eebd-5	5	OPEN	369f52f3-2ccb-414b-a5a8-571d5fd4eebd	2026-03-14 11:25:46.541	2026-03-14 11:25:46.541	\N
dee59f95-fc90-44cb-a489-001914a287c2	369f52f3-2ccb-414b-a5a8-571d5fd4eebd-6	6	OPEN	369f52f3-2ccb-414b-a5a8-571d5fd4eebd	2026-03-14 11:25:46.541	2026-03-14 11:25:46.541	\N
8c7ec12f-6891-4e54-84c1-f7bea3598acd	369f52f3-2ccb-414b-a5a8-571d5fd4eebd-7	7	OPEN	369f52f3-2ccb-414b-a5a8-571d5fd4eebd	2026-03-14 11:25:46.541	2026-03-14 11:25:46.541	\N
a49e39ad-fff4-4e09-87dd-1db500102145	369f52f3-2ccb-414b-a5a8-571d5fd4eebd-8	8	OPEN	369f52f3-2ccb-414b-a5a8-571d5fd4eebd	2026-03-14 11:25:46.541	2026-03-14 11:25:46.541	\N
1fc1ee66-0d7f-4f17-a86e-0890f8b19af8	369f52f3-2ccb-414b-a5a8-571d5fd4eebd-9	9	OPEN	369f52f3-2ccb-414b-a5a8-571d5fd4eebd	2026-03-14 11:25:46.541	2026-03-14 11:25:46.541	\N
225c72a8-e161-488c-b406-f00fce09965e	369f52f3-2ccb-414b-a5a8-571d5fd4eebd-10	10	OPEN	369f52f3-2ccb-414b-a5a8-571d5fd4eebd	2026-03-14 11:25:46.541	2026-03-14 11:25:46.541	\N
4a669675-d99e-40bf-9c3d-262bb32350c6	cf88d98c-bf2d-4489-aae5-aea73fabf402-1	1	OPEN	cf88d98c-bf2d-4489-aae5-aea73fabf402	2026-03-14 11:25:46.548	2026-03-14 11:25:46.548	\N
82c578b6-99eb-4195-9d0b-7e4dcaa919cf	cf88d98c-bf2d-4489-aae5-aea73fabf402-2	2	OPEN	cf88d98c-bf2d-4489-aae5-aea73fabf402	2026-03-14 11:25:46.548	2026-03-14 11:25:46.548	\N
05a1c85f-306d-4127-b468-400e0345ed67	cf88d98c-bf2d-4489-aae5-aea73fabf402-3	3	OPEN	cf88d98c-bf2d-4489-aae5-aea73fabf402	2026-03-14 11:25:46.548	2026-03-14 11:25:46.548	\N
1f541971-22b8-4c53-9a94-1ad4c4b94b5f	cf88d98c-bf2d-4489-aae5-aea73fabf402-4	4	OPEN	cf88d98c-bf2d-4489-aae5-aea73fabf402	2026-03-14 11:25:46.548	2026-03-14 11:25:46.548	\N
8dc8fec5-1b79-432c-a814-cc1e82a647db	cf88d98c-bf2d-4489-aae5-aea73fabf402-5	5	OPEN	cf88d98c-bf2d-4489-aae5-aea73fabf402	2026-03-14 11:25:46.548	2026-03-14 11:25:46.548	\N
9906f10d-5dc8-4f86-8e63-6147db421e48	cf88d98c-bf2d-4489-aae5-aea73fabf402-6	6	OPEN	cf88d98c-bf2d-4489-aae5-aea73fabf402	2026-03-14 11:25:46.548	2026-03-14 11:25:46.548	\N
5b735eed-32cb-43f8-b7a2-8591e01c10d8	cf88d98c-bf2d-4489-aae5-aea73fabf402-7	7	OPEN	cf88d98c-bf2d-4489-aae5-aea73fabf402	2026-03-14 11:25:46.548	2026-03-14 11:25:46.548	\N
479c4f43-6e2c-4b73-ad2e-ab7c2ef2f3cc	cf88d98c-bf2d-4489-aae5-aea73fabf402-8	8	OPEN	cf88d98c-bf2d-4489-aae5-aea73fabf402	2026-03-14 11:25:46.548	2026-03-14 11:25:46.548	\N
dd264da7-8368-4465-9bba-6be4abdb568d	cf88d98c-bf2d-4489-aae5-aea73fabf402-9	9	OPEN	cf88d98c-bf2d-4489-aae5-aea73fabf402	2026-03-14 11:25:46.548	2026-03-14 11:25:46.548	\N
d7b099b6-e966-40df-9806-0fd03c746c4e	cf88d98c-bf2d-4489-aae5-aea73fabf402-10	10	OPEN	cf88d98c-bf2d-4489-aae5-aea73fabf402	2026-03-14 11:25:46.548	2026-03-14 11:25:46.548	\N
68b22029-d3c2-4cbf-8bff-0079560fa4b4	9e8f10c3-ae04-4d40-96ba-ec64baf4dfff-1	1	OPEN	9e8f10c3-ae04-4d40-96ba-ec64baf4dfff	2026-03-14 11:25:46.552	2026-03-14 11:25:46.552	\N
c29746d3-e9ef-45c6-87e4-5b2c1799c8d8	9e8f10c3-ae04-4d40-96ba-ec64baf4dfff-2	2	OPEN	9e8f10c3-ae04-4d40-96ba-ec64baf4dfff	2026-03-14 11:25:46.552	2026-03-14 11:25:46.552	\N
ede52c35-e139-4e60-86e9-890e12a8a261	9e8f10c3-ae04-4d40-96ba-ec64baf4dfff-3	3	OPEN	9e8f10c3-ae04-4d40-96ba-ec64baf4dfff	2026-03-14 11:25:46.552	2026-03-14 11:25:46.552	\N
83844c89-ae85-40ff-a623-e6d2e9c816b8	9e8f10c3-ae04-4d40-96ba-ec64baf4dfff-4	4	OPEN	9e8f10c3-ae04-4d40-96ba-ec64baf4dfff	2026-03-14 11:25:46.552	2026-03-14 11:25:46.552	\N
6a748efa-4d2d-4306-b5f5-9900b6a94bee	9e8f10c3-ae04-4d40-96ba-ec64baf4dfff-5	5	OPEN	9e8f10c3-ae04-4d40-96ba-ec64baf4dfff	2026-03-14 11:25:46.552	2026-03-14 11:25:46.552	\N
74bd7dfe-6c64-41d0-a3a0-064e0b392bac	9e8f10c3-ae04-4d40-96ba-ec64baf4dfff-6	6	OPEN	9e8f10c3-ae04-4d40-96ba-ec64baf4dfff	2026-03-14 11:25:46.552	2026-03-14 11:25:46.552	\N
52588471-5a40-46f3-96a2-2a938bc39f31	9e8f10c3-ae04-4d40-96ba-ec64baf4dfff-7	7	OPEN	9e8f10c3-ae04-4d40-96ba-ec64baf4dfff	2026-03-14 11:25:46.552	2026-03-14 11:25:46.552	\N
2b729394-1af9-49f6-9bd1-2c9103ffc1b5	9e8f10c3-ae04-4d40-96ba-ec64baf4dfff-8	8	OPEN	9e8f10c3-ae04-4d40-96ba-ec64baf4dfff	2026-03-14 11:25:46.552	2026-03-14 11:25:46.552	\N
a4e2fff5-26a2-49e9-af43-a1434a93a0e6	9e8f10c3-ae04-4d40-96ba-ec64baf4dfff-9	9	OPEN	9e8f10c3-ae04-4d40-96ba-ec64baf4dfff	2026-03-14 11:25:46.552	2026-03-14 11:25:46.552	\N
db8a9f60-853a-448b-8005-949653cf11d0	9e8f10c3-ae04-4d40-96ba-ec64baf4dfff-10	10	OPEN	9e8f10c3-ae04-4d40-96ba-ec64baf4dfff	2026-03-14 11:25:46.552	2026-03-14 11:25:46.552	\N
7c7a830a-581b-4ce0-91a9-cd6d4feba2cb	f21badc3-aa6a-4a7a-87b2-36992286fa09-1	1	OPEN	f21badc3-aa6a-4a7a-87b2-36992286fa09	2026-03-14 11:25:46.557	2026-03-14 11:25:46.557	\N
fd87a8d1-7f34-46a9-8693-d38ceab5ff72	f21badc3-aa6a-4a7a-87b2-36992286fa09-2	2	OPEN	f21badc3-aa6a-4a7a-87b2-36992286fa09	2026-03-14 11:25:46.557	2026-03-14 11:25:46.557	\N
ec668080-9360-4dfd-8342-7052789662b8	f21badc3-aa6a-4a7a-87b2-36992286fa09-3	3	OPEN	f21badc3-aa6a-4a7a-87b2-36992286fa09	2026-03-14 11:25:46.557	2026-03-14 11:25:46.557	\N
376f701b-a655-49a8-b776-9627240da194	f21badc3-aa6a-4a7a-87b2-36992286fa09-4	4	OPEN	f21badc3-aa6a-4a7a-87b2-36992286fa09	2026-03-14 11:25:46.557	2026-03-14 11:25:46.557	\N
7a5a3ef3-53a5-46c7-bc6e-c19db0d1b838	f21badc3-aa6a-4a7a-87b2-36992286fa09-5	5	OPEN	f21badc3-aa6a-4a7a-87b2-36992286fa09	2026-03-14 11:25:46.557	2026-03-14 11:25:46.557	\N
c47f9fd8-e4a8-4c50-8561-4fb032b38f69	f21badc3-aa6a-4a7a-87b2-36992286fa09-6	6	OPEN	f21badc3-aa6a-4a7a-87b2-36992286fa09	2026-03-14 11:25:46.557	2026-03-14 11:25:46.557	\N
1814a5a6-7991-4310-9dcf-6a15a76eb239	f21badc3-aa6a-4a7a-87b2-36992286fa09-7	7	OPEN	f21badc3-aa6a-4a7a-87b2-36992286fa09	2026-03-14 11:25:46.557	2026-03-14 11:25:46.557	\N
aab1f394-f4b7-4619-8cba-e2307406e808	f21badc3-aa6a-4a7a-87b2-36992286fa09-8	8	OPEN	f21badc3-aa6a-4a7a-87b2-36992286fa09	2026-03-14 11:25:46.557	2026-03-14 11:25:46.557	\N
80e793af-b175-47a9-880f-ed0b6f203b9e	f21badc3-aa6a-4a7a-87b2-36992286fa09-9	9	OPEN	f21badc3-aa6a-4a7a-87b2-36992286fa09	2026-03-14 11:25:46.557	2026-03-14 11:25:46.557	\N
d0bce96e-dc1d-4929-84d5-0f5b731d8d5d	f21badc3-aa6a-4a7a-87b2-36992286fa09-10	10	OPEN	f21badc3-aa6a-4a7a-87b2-36992286fa09	2026-03-14 11:25:46.557	2026-03-14 11:25:46.557	\N
94510fed-9664-4f90-8ff7-1b50880ab1af	8917b030-0f4a-457e-b848-aad7d4d7711f-2	2	OPEN	8917b030-0f4a-457e-b848-aad7d4d7711f	2026-03-14 11:25:46.563	2026-03-14 11:25:46.563	\N
2b0da004-b287-45a6-be87-f0b95b8ca1c7	8917b030-0f4a-457e-b848-aad7d4d7711f-3	3	OPEN	8917b030-0f4a-457e-b848-aad7d4d7711f	2026-03-14 11:25:46.563	2026-03-14 11:25:46.563	\N
e48c3326-d72a-491c-adb8-730366319b17	8917b030-0f4a-457e-b848-aad7d4d7711f-4	4	OPEN	8917b030-0f4a-457e-b848-aad7d4d7711f	2026-03-14 11:25:46.563	2026-03-14 11:25:46.563	\N
953637c3-9891-4bbe-bcae-2f9118555e92	8917b030-0f4a-457e-b848-aad7d4d7711f-5	5	OPEN	8917b030-0f4a-457e-b848-aad7d4d7711f	2026-03-14 11:25:46.563	2026-03-14 11:25:46.563	\N
18d2a9f1-33e4-4e65-be07-04af2fa1d7d6	8917b030-0f4a-457e-b848-aad7d4d7711f-6	6	OPEN	8917b030-0f4a-457e-b848-aad7d4d7711f	2026-03-14 11:25:46.563	2026-03-14 11:25:46.563	\N
21496c5d-e441-4a72-9b37-ac3cc2115d18	8917b030-0f4a-457e-b848-aad7d4d7711f-7	7	OPEN	8917b030-0f4a-457e-b848-aad7d4d7711f	2026-03-14 11:25:46.563	2026-03-14 11:25:46.563	\N
4609b28a-3650-4aa4-bbb1-5ad77b932de9	8917b030-0f4a-457e-b848-aad7d4d7711f-8	8	OPEN	8917b030-0f4a-457e-b848-aad7d4d7711f	2026-03-14 11:25:46.563	2026-03-14 11:25:46.563	\N
2527c7e0-8fbc-4e76-a50f-96a20269f6be	8917b030-0f4a-457e-b848-aad7d4d7711f-9	9	OPEN	8917b030-0f4a-457e-b848-aad7d4d7711f	2026-03-14 11:25:46.563	2026-03-14 11:25:46.563	\N
6e953ea1-52c3-4d7b-8cce-eb4ffcaee28a	8917b030-0f4a-457e-b848-aad7d4d7711f-10	10	OPEN	8917b030-0f4a-457e-b848-aad7d4d7711f	2026-03-14 11:25:46.563	2026-03-14 11:25:46.563	\N
14721323-f59c-4590-aa3f-054a5d42b230	8917b030-0f4a-457e-b848-aad7d4d7711f-1	1	SOLD	8917b030-0f4a-457e-b848-aad7d4d7711f	2026-03-14 11:25:46.563	2026-03-14 11:40:55.58	5b149e63-391a-44b4-bb06-528f2affc0ec
\.


--
-- Data for Name: Transactions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Transactions" (id, amount, "eventId", "ticketId", "userId", status, "createdAt", "updatedAt") FROM stdin;
418f1280-bbc2-481d-9415-356c8a887c3a	95	8917b030-0f4a-457e-b848-aad7d4d7711f	14721323-f59c-4590-aa3f-054a5d42b230	5b149e63-391a-44b4-bb06-528f2affc0ec	COMPLETED	2026-03-14 11:40:45.832	2026-03-14 11:40:55.581
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Users" (id, email, password, "firstName", "lastName", role, "createdAt", "updatedAt") FROM stdin;
5b149e63-391a-44b4-bb06-528f2affc0ec	mahir@btex.com	$argon2id$v=19$m=65536,t=3,p=4$1WC412lT06rw8xGlEYtE1A$slrYLIjsENQmvb9IGtKktFdIJPpL7LODnfmHxBQe5oM	Mahir	Test	CUSTOMER	2026-03-14 11:34:24.612	2026-03-14 11:34:24.612
3bc3e165-17c1-4bea-880c-fc744038c5bc	demo@btex.com	$argon2id$v=19$m=65536,t=3,p=4$aGC/kEcTcP0RR9kcwWc5lw$EZFdiiie0snY3Y7flSFjUGZCPrfWuSayXmNoTP44iwI	Demo	User	CUSTOMER	2026-03-14 11:44:42.92	2026-03-14 11:44:42.92
fcc592ef-bf89-4318-8b99-4a52c26a2961	admin@btex.com	$argon2id$v=19$m=65536,t=3,p=4$L0gyNMBLsbkrQ/WAL2oc5w$o/xdBd72AWmch9QHE6n9B7uJNrRfHYTxdsck0dxCYFA	Admin	Admin	ADMIN	2026-03-14 11:51:35.437	2026-03-14 11:51:35.437
\.


--
-- Name: Events Events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Events"
    ADD CONSTRAINT "Events_pkey" PRIMARY KEY (id);


--
-- Name: Tickets Tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Tickets"
    ADD CONSTRAINT "Tickets_pkey" PRIMARY KEY (id);


--
-- Name: Transactions Transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Transactions"
    ADD CONSTRAINT "Transactions_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: Tickets_ticketCode_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Tickets_ticketCode_key" ON public."Tickets" USING btree ("ticketCode");


--
-- Name: Users_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Users_email_key" ON public."Users" USING btree (email);


--
-- Name: Users_email_password_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Users_email_password_key" ON public."Users" USING btree (email, password);


--
-- Name: event_monitor _RETURN; Type: RULE; Schema: public; Owner: -
--

CREATE OR REPLACE VIEW public.event_monitor AS
 SELECT e.id,
    e.name,
    e.type,
    e.capacity,
    e.amount,
    e."isActive" AS is_active,
    count(*) FILTER (WHERE (t.status = 'OPEN'::public."TicketStatus")) AS open_tickets,
    count(*) FILTER (WHERE (t.status = 'RESERVED'::public."TicketStatus")) AS reserved_tickets,
    count(*) FILTER (WHERE (t.status = 'SOLD'::public."TicketStatus")) AS sold_tickets,
    COALESCE(sum(e.amount) FILTER (WHERE (t.status = 'SOLD'::public."TicketStatus")), (0)::double precision) AS total_revenue,
        CASE
            WHEN (e.capacity = 0) THEN (0)::numeric
            ELSE round((((count(*) FILTER (WHERE (t.status = ANY (ARRAY['RESERVED'::public."TicketStatus", 'SOLD'::public."TicketStatus"]))))::numeric / (e.capacity)::numeric) * (100)::numeric), 2)
        END AS occupancy_rate,
    e."createdAt" AS created_at
   FROM (public."Events" e
     LEFT JOIN public."Tickets" t ON ((t."eventId" = e.id)))
  GROUP BY e.id;


--
-- Name: Tickets Tickets_eventId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Tickets"
    ADD CONSTRAINT "Tickets_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES public."Events"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Tickets Tickets_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Tickets"
    ADD CONSTRAINT "Tickets_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Transactions Transactions_eventId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Transactions"
    ADD CONSTRAINT "Transactions_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES public."Events"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Transactions Transactions_ticketId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Transactions"
    ADD CONSTRAINT "Transactions_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES public."Tickets"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Transactions Transactions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Transactions"
    ADD CONSTRAINT "Transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict rP8NTaSOvZ0XRJ84ijQ6odXbDFFTJMfU7soKTz3wHuixTOwHiRfQZSuv7FNeH1B

