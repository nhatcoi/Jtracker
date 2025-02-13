create table users
(
    id             uuid      default gen_random_uuid() not null
        primary key,
    firstname      varchar(100),
    lastname       varchar(100),
    email          varchar(255)                        not null
        unique,
    password       varchar(255),
    created_at     timestamp default CURRENT_TIMESTAMP,
    provider       varchar(100),
    provider_id    varchar(255),
    email_verified boolean   default false,
    avatar         varchar(255),
    active         boolean   default true
);

alter table users
    owner to postgres;

create table habits
(
    id              uuid      default gen_random_uuid() not null
        primary key,
    user_id         uuid
        references users
            on delete cascade,
    name            varchar(255)                        not null,
    description     text,
    frequency       varchar(50)
        constraint habits_frequency_check
            check ((frequency)::text = ANY
        ((ARRAY ['daily'::character varying, 'weekly'::character varying, 'monthly'::character varying])::text[])),
    goal            integer   default 1,
    created_at      timestamp default now(),
    start_date      date      default now(),
    habit_type      varchar(50),
    status          varchar(20),
    active          boolean,
    end_date        date,
    achieved_period integer   default 0,
    reminder        time
);

alter table habits
    owner to postgres;

create table habit_logs
(
    id           uuid        default gen_random_uuid() not null
        primary key,
    habit_id     uuid
        references habits
            on delete cascade,
    period_end   date,
    notes        text,
    period_start date,
    achieved     integer     default 0,
    status_log   varchar(20) default 'DOING'::character varying,
    created_at   timestamp
);

alter table habit_logs
    owner to postgres;

create table reminders
(
    id            uuid default gen_random_uuid() not null
        primary key,
    habit_id      uuid
        references habits
            on delete cascade,
    reminder_time time                           not null,
    type          varchar(255)
);

alter table reminders
    owner to postgres;

create table auth_providers
(
    id          uuid      default gen_random_uuid() not null
        primary key,
    user_id     uuid
        references users
            on delete cascade,
    provider    varchar(255)                        not null
        constraint auth_providers_provider_check
            check ((provider)::text = ANY
        (ARRAY [('google'::character varying)::text, ('facebook'::character varying)::text])),
    provider_id varchar(255)                        not null
        unique,
    created_at  timestamp default now()
);

alter table auth_providers
    owner to postgres;

create table jwt_tokens
(
    id            uuid      default gen_random_uuid() not null
        primary key,
    user_id       uuid
        references users
            on delete cascade,
    refresh_token text                                not null,
    expires_at    timestamp                           not null,
    created_at    timestamp default now()
);

alter table jwt_tokens
    owner to postgres;

create table device_tokens
(
    id           uuid      default gen_random_uuid() not null
        primary key,
    user_id      uuid
        references users
            on delete cascade,
    device_token varchar(255)                        not null,
    platform     varchar(255)                        not null
        constraint device_tokens_platform_check
            check ((platform)::text = ANY
        (ARRAY [('ios'::character varying)::text, ('android'::character varying)::text, ('web'::character varying)::text])),
    created_at   timestamp default now(),
    unique_token varchar(255)
        constraint ukggintorm5aj4wlwrvhua7xtta
            unique,
    unique (user_id, device_token)
);

alter table device_tokens
    owner to postgres;

create table notifications
(
    id       uuid      default gen_random_uuid() not null
        primary key,
    user_id  uuid
        references users
            on delete cascade,
    title    varchar(255)                        not null,
    message  text                                not null,
    sent_at  timestamp default now(),
    status   varchar(20)                         not null
        constraint notifications_status_check
            check ((status)::text = ANY
        ((ARRAY ['sent'::character varying, 'pending'::character varying, 'failed'::character varying])::text[])),
    provider varchar(50)                         not null
        constraint notifications_provider_check
            check ((provider)::text = ANY ((ARRAY ['FCM'::character varying, 'OneSignal'::character varying])::text[]))
);

alter table notifications
    owner to postgres;

create table roles
(
    id          serial
        primary key,
    name        varchar(50) not null
        unique,
    description text
);

alter table roles
    owner to postgres;

create table permissions
(
    id          serial
        primary key,
    name        varchar(50) not null
        unique,
    description text
);

alter table permissions
    owner to postgres;

create table user_roles
(
    id      serial
        primary key,
    user_id uuid
        references users
            on delete cascade,
    role_id integer
        references roles
            on delete cascade
);

alter table user_roles
    owner to postgres;

create table role_permissions
(
    id            serial
        primary key,
    role_id       integer
        references roles
            on delete cascade,
    permission_id integer
        references permissions
            on delete cascade
);

alter table role_permissions
    owner to postgres;

