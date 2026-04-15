# F&F Ops Hub User Workflow Spec

## 1. Purpose of This Document

This document explains the webapp only from the human-use perspective.

It is written for an LLM that needs to understand:

- what parts of the website people see
- what each tab or section is for
- who uses each area
- what decisions people make inside the app
- how work moves from one area to another

This document intentionally avoids:

- technical design
- system architecture
- implementation details
- backend behavior
- internal data flow
- infrastructure clues

The goal is to describe the product as a working business tool, not as software.

## 2. What This Webapp Is

F&F Ops Hub is the day-to-day operating workspace for a used car dealership.

People use it to:

- manage inventory
- track where each car is in its journey
- handle customer activity
- prepare cars for sale
- monitor repairs and reconditioning
- control keys and vehicle locations
- close deals and paperwork
- manage staff tasks and approvals
- review business performance
- run the public-facing dealership website

The app also includes the customer-facing website, so it serves both dealership staff and shoppers.

## 3. Main Parts of the Product

The overall product has three user-facing layers:

1. The public website
2. The internal staff dashboard
3. Special-use screens for in-store display and role-specific work

## 4. Public Website

The public website is for shoppers and people contacting the dealership.

Its main pages are:

- Home
- Cars
- Car Detail
- Sell or Trade
- Contact
- Privacy / Terms / SMS Terms

## 4.1 Home

The home page introduces the dealership.

Its job is to:

- create trust
- show the dealership’s style and positioning
- highlight recent sold vehicles
- encourage people to shop inventory
- encourage people to sell or trade a vehicle
- show reviews and reputation signals

This page is mainly for first impressions and lead generation.

## 4.2 Cars

The Cars page is the inventory browsing page.

Shoppers use it to:

- browse available vehicles
- narrow choices
- compare options
- find a car that fits budget and preferences

This page is the main shopping catalog.

## 4.3 Car Detail

Each vehicle has a detail page for shoppers.

People use it to:

- see the vehicle photos
- review the price
- understand the vehicle’s key features
- read its highlights and selling points
- estimate whether it fits their needs
- move closer to contacting the store

This page helps turn interest into inquiry.

## 4.4 Sell or Trade

This page is for people who want to sell their current car or use it as a trade-in.

They use it to:

- share vehicle details
- request an offer
- start a trade conversation

This page supports car acquisition as well as customer lead generation.

## 4.5 Contact

The contact page is for direct communication.

People use it to:

- call
- text
- send a message
- check hours and location

This is the direct-contact page for shoppers who are ready to ask questions or visit.

## 4.6 Legal Pages

The legal pages explain privacy, terms, and texting consent.

They exist to set expectations and document customer permissions.

## 5. Lobby Display

There is a special in-store display screen for the waiting area or showroom.

Its purpose is to:

- welcome visitors
- show upcoming appointments
- highlight vehicles
- reinforce the dealership brand
- give customers something useful to look at while waiting

This is not a staff work screen. It is a customer-facing showroom display.

## 6. Internal Staff Dashboard

The internal dashboard is where the dealership team does its daily work.

It is role-based, which means different people see different tools depending on their job.

The internal workspace includes these main areas:

1. Dashboard
2. Vehicles
3. Customers
4. Appointments
5. Appraisals
6. Recon
7. Intake
8. Detailing
9. Operations
10. Location
11. Diagnostics
12. Service Bay
13. Pricing Engine
14. AutoCheck
15. Sold
16. Title
17. Reimbursements
18. Vendors
19. Accounting
20. Automations
21. Settings

There are also redirect or support areas such as:

- People
- Tasks

These are not separate major products in practice; they lead into other work areas.

## 7. How the Dealership Uses the App Overall

At a high level, the app supports this business story:

1. A vehicle comes in
2. Staff inspect it
3. The dealership decides what work it needs
4. Repairs and cleanup happen
5. Photos and merchandising happen
6. The car becomes sale-ready
7. A customer shows interest
8. The dealership manages communication and appointments
9. The car is sold
10. Paperwork, title work, and delivery follow-through are completed

Different tabs exist to support one part of that journey.

## 8. Internal Areas, Tabs, and Tools

## 8.1 Dashboard

This is the first screen staff see after logging in.

Purpose:

- show what matters today
- highlight urgent work
- keep each person focused on their own job
- give managers a command view of the operation

Different people experience the dashboard differently.

Examples of what it is used for:

- a manager sees where the operation is getting stuck
- a front-office user sees customer and appointment priorities
- an operations user sees workflow bottlenecks
- a field or support user sees assigned work and time-sensitive tasks

The dashboard is the daily starting point.

## 8.2 Vehicles

This is the main inventory workspace.

People use it to:

- see all active cars
- search by stock number, VIN, make, model, or year
- understand each car’s current status
- review condition and readiness
- move into a full vehicle profile

The list view answers:

- what cars do we have
- what stage is each car in
- which cars need attention

### Vehicle Detail

The vehicle detail page is the central record for one specific car.

People use it to:

- review the full vehicle story
- check where the car is in the process
- see who owns the next step
- review notes, photos, and issues
- update sale progress
- track title and deposit status
- manage merchandising readiness

This page is the closest thing the app has to a “master record” for a car.

## 8.3 Customers

This area is for customer records and relationship tracking.

People use it to:

- search for customers
- understand recent activity
- see how active the sales pipeline is
- manage duplicates
- open a full customer record

### Customer Tabs

The customer detail page has three main tabs:

#### Overview

Purpose:

- see the customer at a glance
- review recent activity
- understand current opportunities

Use cases:

- identifying who the customer is
- seeing whether they are active or dormant
- checking where the relationship stands

#### Communications

Purpose:

- review conversations and contact history
- understand how the dealership has been engaging with the customer

Use cases:

- follow-up preparation
- handoff between team members
- checking what was already said

#### Notes

Purpose:

- keep internal observations in one place
- store context that helps the next staff member understand the customer

Use cases:

- remembering preferences
- logging promises or special situations
- preserving sales context

## 8.4 Appointments

This is the appointment management area.

People use it to:

- schedule visits
- confirm customer arrival plans
- prepare vehicles for appointments
- assign follow-up responsibility

The appointment area helps the team stay organized around showroom visits and test drives.

It is especially important for front-office and sales coordination.

## 8.5 Appraisals

This area handles trade-ins and sell-your-car opportunities.

People use it to:

- review incoming appraisal requests
- understand which acquisition opportunities need action
- move trade conversations forward

This area supports buying cars from the public, not just selling cars to customers.

## 8.6 Recon

This area manages repair and reconditioning decisions.

People use it to:

- see which vehicles need work
- review known issues
- decide what should be fixed
- assign work to shops or vendors
- monitor how long cars have been stuck in reconditioning

This is one of the most important operational screens in the app.

It answers questions like:

- what is broken
- what needs approval
- what is waiting on parts
- what is still at a shop
- which cars are aging in the process

## 8.7 Intake

This area handles the first structured review of a vehicle after it arrives.

People use it to:

- inspect the car
- capture condition findings
- log warning signs
- confirm the basics are done
- document what needs attention before the car moves forward

This is the starting checkpoint for the operational life of a car.

It is where the team turns an incoming vehicle into a managed work item.

## 8.8 Detailing

This area is for cleaning, finishing, and making vehicles presentable.

People use it to:

- assign detail work
- guide the detail process
- record blockers
- track whether the vehicle is truly photo-ready

This area is highly task-oriented and is used by the people responsible for making a vehicle look retail-ready.

## 8.9 Operations

This is a broader work-execution hub.

It contains multiple views that help people manage daily work.

### Operations Tabs

#### My Day

Purpose:

- show an individual person what they should work on today
- create a daily focus list
- help someone move through work in order

Use cases:

- a staff member checking their daily queue
- a manager drilling into one employee’s day

#### Board

Purpose:

- show work at a group level
- help people understand what is in progress across the operation

Use cases:

- tracking work by status
- seeing bottlenecks
- organizing team execution

#### Team

Purpose:

- manager view of people and workload
- understand who is overloaded and who is available

Use cases:

- reviewing team balance
- identifying gaps
- moving attention to the right person

#### Tasks & Photos

Purpose:

- support older or broader work patterns around task and merchandising coordination

Use cases:

- reviewing assigned tasks
- tracking photo-related work
- handling legacy day-to-day execution flows

Operations is a practical “get work done” workspace.

## 8.10 Location

This area answers the physical question: where is each car?

People use it to:

- locate vehicles on-site
- see whether a vehicle is at a vendor, auction, or employee location
- find missing or misplaced cars
- identify frontline and showcase cars
- confirm whether a car is ready for an appointment

This area is essential for dealership logistics.

## 8.11 Diagnostics

This area is for vehicle problem-checking and readiness review.

People use it to:

- review diagnostic sessions
- understand warning codes and vehicle health clues
- track who looked at a vehicle
- see whether problems are resolved or still open

This area supports better repair decisions and cleaner reconditioning handoffs.

## 8.12 Service Bay

This area is a specialized work center for deeper vehicle service activity.

It contains multiple tabs.

### Service Bay Tabs

#### Overview

Purpose:

- show the big picture of active service work
- summarize what is open, urgent, or delayed

Use cases:

- seeing service workload
- spotting work that needs immediate action

#### OBD Scanner

Purpose:

- support direct vehicle checking and scanning work

Use cases:

- reading a car’s current problem signals
- diagnosing what may be wrong before work is assigned

#### Code Library

Purpose:

- help staff understand vehicle warning meanings

Use cases:

- translating warning codes into understandable problems
- improving judgment about severity and likely next steps

#### Work Orders

Purpose:

- organize service jobs that need to be performed
- clarify what work has been requested and approved

Use cases:

- assigning service work
- tracking job progress
- reviewing estimated versus completed work

#### Inspection

Purpose:

- support more formal service-related checklists

Use cases:

- recording what was inspected
- documenting pass/fail observations

#### Repair Guide

Purpose:

- help staff think through likely causes and repair direction

Use cases:

- learning what a problem may mean
- deciding what kind of fix or parts may be needed

This area is for more advanced vehicle problem-solving and service organization.

## 8.13 Pricing Engine

This area is for valuation and buying decisions.

It contains multiple tabs.

### Pricing Engine Tabs

#### Overview

Purpose:

- show how the pricing process is performing overall
- summarize buying and appraisal quality at a high level

Use cases:

- management review
- confidence-checking the pricing process

#### Quick Appraise

Purpose:

- generate a fast working estimate for a vehicle

Use cases:

- early buy/no-buy thinking
- rough appraisal conversations

#### Auction Data

Purpose:

- review market reference information used for pricing judgment

Use cases:

- comparing vehicles against the market
- understanding whether a target deal makes sense

#### Recon Rules

Purpose:

- define how repair expectations should influence pricing

Use cases:

- shaping consistent buy decisions
- adjusting how much repair needs matter

#### Risk Rules

Purpose:

- define how risk affects vehicle decisions

Use cases:

- discouraging problem buys
- applying more discipline to uncertain cars

This area helps the dealership stay disciplined when acquiring and pricing vehicles.

## 8.14 AutoCheck

This area supports vehicle-history and valuation review.

### AutoCheck Tabs

#### Reports

Purpose:

- see which vehicles still need their reports
- monitor report completion progress

Use cases:

- closing information gaps on inventory
- making sure cars have the expected supporting history

#### Auction Pricer

Purpose:

- help staff think through pricing from an auction perspective

Use cases:

- evaluating car opportunities
- comparing market assumptions

This area is a focused support tool rather than a full general workspace.

## 8.15 Sold

This area manages the post-sale process.

People use it to:

- review sold deals
- see what paperwork is still incomplete
- track delivery readiness
- upload final documents
- confirm that follow-through is done

This is where a sold car stops being just a sale and becomes a completed transaction.

It is especially important for avoiding loose ends after the handshake.

## 8.16 Title

This area manages title and registration-related follow-through.

People use it to:

- see which title items are pending
- review what paperwork is still needed
- track progress toward completion

This is a compliance and paperwork control board.

## 8.17 Reimbursements

This area is for staff expense and repayment requests.

People use it to:

- submit expenses
- attach them to vehicles or vendors when relevant
- review approval status
- understand what is still owed

Managers use it to:

- approve or deny requests
- monitor pending reimbursements

This is a staff-support and expense-control area.

## 8.18 Vendors

This area manages outside service partners.

People use it to:

- maintain a list of shops and service providers
- review who the dealership works with
- keep vendor information organized

This is important because much of dealership work depends on outside partners.

## 8.19 Accounting

This area is the financial workspace.

It contains several tabs.

### Accounting Tabs

#### Overview

Purpose:

- summarize the financial picture
- give a quick operating snapshot

Use cases:

- seeing current balance patterns
- checking recent business activity

#### Accounts

Purpose:

- organize the business’s financial categories

Use cases:

- reviewing where money activity belongs
- understanding how the business is structured financially

#### Journal

Purpose:

- review the running record of business events

Use cases:

- checking what happened recently
- confirming entries are present and understandable

#### Recurring

Purpose:

- manage repeating expenses or repeating financial activity

Use cases:

- checking what recurs regularly
- making sure routine obligations are not missed

This area is for financial control, reporting, and discipline.

## 8.20 Automations

This area helps people understand and supervise automatic business actions.

### Automations Tabs

#### Automation Rules

Purpose:

- show what automatic behaviors exist
- explain what kinds of situations trigger them

Use cases:

- understanding what the system is meant to do on its own
- checking whether the rules still make sense for the business

#### Activity Log

Purpose:

- show what automatic actions have recently happened

Use cases:

- reviewing whether automation behaved as expected
- confirming that an action actually took place

#### Overrides

Purpose:

- show exceptions where normal automatic behavior has been intentionally blocked or altered

Use cases:

- handling special-case vehicles or situations
- removing an exception once normal rules should resume

This area is mostly for supervision and exception handling.

## 8.21 Settings

This area is for account, workplace, and control settings.

It contains three main tabs.

### Settings Tabs

#### General

Purpose:

- manage broad business settings
- update personal basics such as password-related actions
- review calling and dealership-wide preferences

Use cases:

- adjusting general operating settings
- checking communication setup

#### Workspace

Purpose:

- manage people and workspace-level administration

Use cases:

- adding or updating users
- controlling who can work in the system

#### Security

Purpose:

- review security-related controls and oversight areas

Use cases:

- confirming who should have access
- checking for risks or unusual situations

This area is administrative and is not part of normal day-to-day workflow for most staff.

## 9. Supporting or Redirect Areas

## 9.1 People

This leads people back into the customer-focused workspace.

Functionally, it serves as another path into customer management rather than a separate product.

## 9.2 Tasks

This leads into the broader Operations area.

Functionally, task work is treated as part of daily execution rather than as a completely separate product.

## 10. Who Uses What

At a high level:

- ownership uses:
  - dashboard
  - vehicles
  - recon
  - sold
  - title
  - pricing engine
  - accounting
  - automations
  - settings
- general management uses:
  - dashboard
  - vehicles
  - recon
  - operations
  - appointments
  - sold
  - title
  - pricing-related tools
- front-office / BDC uses:
  - dashboard
  - customers
  - appointments
  - appraisals
  - sold
  - some inventory and workflow screens
- inventory/logistics roles use:
  - vehicles
  - intake
  - recon
  - location
  - vendors
  - operations
- detailing roles use:
  - detailing
  - operations
- photography roles use:
  - operations
  - inventory-readiness surfaces
- title/admin roles use:
  - title
  - sold
  - customer and appointment context as needed

Not everyone sees everything. The app is designed so people mainly see tools that fit their job.

## 11. How Work Moves Across Tabs

The app is easiest to understand when seen as a chain of handoffs.

### Vehicle Preparation Flow

1. Vehicles
2. Intake
3. Recon
4. Detailing
5. Operations / Photo-related work
6. Vehicles again, now as sale-ready inventory

### Customer Sales Flow

1. Public website
2. Customers
3. Appointments
4. Sold
5. Title

### Trade-In / Acquisition Flow

1. Sell or Trade page
2. Appraisals
3. Pricing Engine
4. Vehicles
5. Intake

### Paperwork and Closeout Flow

1. Sold
2. Title
3. Reimbursements or Accounting when needed

These flows are the real reason the tabs exist.

## 12. How an LLM Should Think About This Product

If an LLM needs to reason about this webapp correctly, it should think in business terms:

- This is a dealership work environment.
- The main object is the car.
- The second key object is the customer.
- The app follows the life of a car from arrival to sale.
- The app also follows the life of a customer from interest to delivery.
- Different tabs exist because different job roles own different parts of that story.
- The app is designed around operational clarity, accountability, and completion.

## 13. Product Summary in One Paragraph

F&F Ops Hub is a dealership workspace that helps staff receive vehicles, inspect them, repair them, clean them, merchandise them, sell them, deliver them, and finish the paperwork afterward, while also supporting customer communication, trade-in activity, staff task management, financial oversight, and the public shopping website.
