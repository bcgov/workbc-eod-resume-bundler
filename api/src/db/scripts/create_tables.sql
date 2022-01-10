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

CREATE TABLE IF NOT EXISTS public.catchments
(
    catchment_id integer NOT NULL,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    service_provider character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT catchments_pkey PRIMARY KEY (catchment_id)
)

TABLESPACE pg_default;

ALTER TABLE public.catchments
    OWNER to postgres;



CREATE TABLE IF NOT EXISTS public.centres
(
    centre_id integer NOT NULL,
    catchment_id integer NOT NULL,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT centres_pkey PRIMARY KEY (centre_id),
    CONSTRAINT centres_fkey FOREIGN KEY (catchment_id)
        REFERENCES public.catchments (catchment_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE public.centres
    OWNER to postgres;

    

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
    minimum_requirements character varying COLLATE pg_catalog."default",
    other_information character varying COLLATE pg_catalog."default",
    created_by character varying COLLATE pg_catalog."default" NOT NULL,
    created_date timestamp with time zone NOT NULL,
    job_description_file bytea,
    job_description_file_name character varying COLLATE pg_catalog."default",
    job_description_file_type character varying COLLATE pg_catalog."default",
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
    catchment_id integer NOT NULL,
    centre_id integer NOT NULL,
    bundled boolean,
    created_date date,
    created_by character varying COLLATE pg_catalog."default",
    created_by_email character varying COLLATE pg_catalog."default",
    CONSTRAINT submissions_pkey PRIMARY KEY (submission_id),
    CONSTRAINT submissions_fkey_catchments FOREIGN KEY (catchment_id)
        REFERENCES public.catchments (catchment_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT submissions_fkey_centres FOREIGN KEY (centre_id)
        REFERENCES public.centres (centre_id) MATCH SIMPLE
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
    catchment_id integer NOT NULL,
    centre_id integer NOT NULL,
    client_name character varying COLLATE pg_catalog."default" NOT NULL,
    preferred_name character varying COLLATE pg_catalog."default",
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
    edited_date date,
    edited_by character varying COLLATE pg_catalog."default",
    CONSTRAINT client_applications_pkey PRIMARY KEY (client_application_id),
    CONSTRAINT client_applications_fkey_catchments FOREIGN KEY (catchment_id)
        REFERENCES public.catchments (catchment_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT client_applications_fkey_centres FOREIGN KEY (centre_id)
        REFERENCES public.centres (centre_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE public.client_applications
    OWNER to postgres;

