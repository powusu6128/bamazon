create database if not exists bamazon2;

show databases;

USE bamazon2;

create table products (
  item_id integer  not null auto_increment primary key,

  product_name varchar(40) NOT NULL,

  department_name varchar (40) NULL,

  price decimal(10,2) not null,

  stock_quantity int not null default '0'
);

Select * From products;

insert into products(product_name, department_name,price, stock_quantity)

values('shoes','dsw',12,120),

('phone','electronics',560,25),

('banana','walmar',1.99,60),

('paint','ware house',5,50),

('paris bow','kitch appliance',12,60),

('shoes','dsw',12,60),
 
('home theater','electronic',1200,5),

('tomatoe sidling','gardening',0.99,360),

('door','ware house',120,25),

('table','slamberland',240,5),

 ('fridge','sears',1200,25);



CREATE TABLE departments (
  department_id  int not null auto_increment primary key,

  department_name varchar (100) NOT NULL,

  overhead_costs decimal (10,2) NOT NULL default '0.00'

);
drop table departments;

select * from departments;


insert into departments(department_name,overhead_costs)
values('dsw', 2000),
			('electronics', 1500),
            ('gardening', 1000),
            ('slanberland', 7000),
            ('walmart', 2000);
            
            
alter table products add column product_sales decimal  default 00.00;

select departments.department_id, departments.department_name,departments.overhead_costs,products.product_sales as total_sales from departments inner join products on 
departments.department_name= products.department_name group by department_name;

