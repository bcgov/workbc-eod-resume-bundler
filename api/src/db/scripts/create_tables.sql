-- CREATE DATABASE resume_bundler
--     WITH 
--     OWNER = postgres
--     ENCODING = 'UTF8'
--     LC_COLLATE = 'en_US.utf8'
--     LC_CTYPE = 'en_US.utf8'
--     TABLESPACE = pg_default
--     CONNECTION LIMIT = -1;


-- CREATE SCHEMA public
--     AUTHORIZATION postgres;

-- COMMENT ON SCHEMA public
--     IS 'standard public schema';

-- GRANT ALL ON SCHEMA public TO PUBLIC;

-- GRANT ALL ON SCHEMA public TO postgres;

CREATE TABLE IF NOT EXISTS public.job_orders
(
    job_id character varying COLLATE pg_catalog."default" NOT NULL,
    employer character varying COLLATE pg_catalog."default" NOT NULL,
    "position" character varying COLLATE pg_catalog."default" NOT NULL,
    start_date date NOT NULL,
    deadline date NOT NULL,
    location character varying COLLATE pg_catalog."default" NOT NULL,
    vacancies integer NOT NULL,
    catchments character varying[] COLLATE pg_catalog."default" NOT NULL,
    other_information character varying COLLATE pg_catalog."default",
    created_by character varying COLLATE pg_catalog."default" NOT NULL,
    created_date timestamp with time zone NOT NULL,
    job_description bytea[],
    edited_by character varying COLLATE pg_catalog."default",
    edited_date timestamp with time zone,
    status character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT job_orders_pkey PRIMARY KEY (job_id)
)

TABLESPACE pg_default;

ALTER TABLE public.job_orders
    OWNER to postgres;



CREATE TABLE IF NOT EXISTS public.submissions
(
    submission_id character varying COLLATE pg_catalog."default" NOT NULL,
    job_id character varying COLLATE pg_catalog."default" NOT NULL,
    catchment character varying COLLATE pg_catalog."default" NOT NULL,
    centre character varying COLLATE pg_catalog."default" NOT NULL,
    bundled boolean,
    created_date date,
    created_by character varying COLLATE pg_catalog."default",
    CONSTRAINT submissions_pkey PRIMARY KEY (submission_id),
    CONSTRAINT job_orders_fkey FOREIGN KEY (job_id)
        REFERENCES public.job_orders (job_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE public.submissions
    OWNER to postgres;


CREATE TABLE IF NOT EXISTS public.client_applications
(
    client_application_id character varying COLLATE pg_catalog."default" NOT NULL,
    submission_id character varying COLLATE pg_catalog."default" NOT NULL,
    catchment character varying COLLATE pg_catalog."default" NOT NULL,
    centre character varying COLLATE pg_catalog."default" NOT NULL,
    client_name character varying COLLATE pg_catalog."default" NOT NULL,
    client_case_number character varying COLLATE pg_catalog."default" NOT NULL,
    resume_file bytea,
    resume_file_name character varying COLLATE pg_catalog."default",
    resume_file_type character varying COLLATE pg_catalog."default",
    consent boolean NOT NULL,
    other jsonb,
    status character varying COLLATE pg_catalog."default",
    flagged boolean,
    bundled boolean,
    created_date date,
    created_by character varying COLLATE pg_catalog."default",
    CONSTRAINT client_applications_pkey PRIMARY KEY (client_application_id)
)

TABLESPACE pg_default;

ALTER TABLE public.client_applications
    OWNER to postgres;