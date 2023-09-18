# CDS-TS Dispatcher

<img src="https://img.shields.io/badge/SAP-0FAAFF?style=for-the-badge&logo=sap&logoColor=white" /> <img src="https://img.shields.io/badge/ts--node-3178C6?style=for-the-badge&logo=ts-node&logoColor=white" /> <img src="https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" /> <img src="https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white" /><img src="https://img.shields.io/badge/json-5E5C5C?style=for-the-badge&logo=json&logoColor=white" /> <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" /> <img src="https://img.shields.io/badge/Cloud%20Foundry-0C9ED5?style=for-the-badge&logo=Cloud%20Foundry&logoColor=white" /> <img src="https://img.shields.io/badge/kubernetes-326ce5.svg?&style=for-the-badge&logo=kubernetes&logoColor=white" />

`SAP CAP` `NodeJS-based project` using TypesScript decorators for rapid development.

The goal of SAP CAP Nodejs Decorators is to significantly reduce the boilerplate code required to implement JS handlers provided by the SAP CAP framework.

<a name="readme-top"></a>

## Table of Contents

- [CDS-TS Dispatcher](#cds-ts-dispatcher)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [Install CDS-TS-Dispatcher](#install-cds-ts-dispatcher)
    - [Generate CDS Typed entities](#generate-cds-typed-entities)
  - [Architecture](#architecture)
  - [Usage](#usage)
    - [CDSDispatcher](#cdsdispatcher)
    - [Decorators](#decorators)
      - [Class](#class)
        - [EntityHandler](#entityhandler)
        - [ServiceLogic](#servicelogic)
        - [Repository](#repository)
          - [Optional BaseRepository](#optional-baserepository)
      - [Fields](#fields)
        - [Inject](#inject)
        - [Inject SRV](#inject-srv)
      - [Methods](#methods)
        - [Before](#before)
          - [BeforeCreate](#beforecreate)
          - [BeforeRead](#beforeread)
          - [BeforeUpdate](#beforeupdate)
          - [BeforeDelete](#beforedelete)
        - [After](#after)
          - [AfterCreate](#aftercreate)
          - [AfterRead](#afterread)
          - [AfterUpdate](#afterupdate)
          - [AfterDelete](#afterdelete)
        - [On](#on)
          - [OnCreate](#oncreate)
          - [OnRead](#onread)
          - [OnUpdate](#onupdate)
          - [OnDelete](#ondelete)
          - [OnAction](#onaction)
          - [OnFunction](#onfunction)
          - [OnBoundAction](#onboundaction)
          - [OnBoundFunction](#onboundfunction)
        - [Fiori draft](#fiori-draft)
          - [Draft](#draft)
          - [OnNewDraft](#onnewdraft)
          - [OnCancelDraft](#oncanceldraft)
          - [OnEditDraft](#oneditdraft)
          - [OnSaveDraft](#onsavedraft)
          - [OnBoundActionDraft](#onboundactiondraft)
          - [OnBoundFunctionDraft](#onboundfunctiondraft)
    - [Example](#example)
  - [Contributing](#contributing)
  - [License](#license)
  - [Authors](#authors)

## Installation

### Install CDS-TS-Dispatcher

```bash
npm install cds-ts-dispatcher
npm install reflect-metadata
```

Once installed, import `reflect-metadata` in your `server.ts`

```typescript
import 'reflect-metadata'
```

Modify your `tsconfig.json` to enable `decorators` usage :

```bash
"experimentalDecorators": true,
"emitDecoratorMetadata": true,
```

### Generate CDS Typed entities

The following command should be used to generate typed entity classes

```bash
npx @cap-js/cds-typer ./srv/controller/mainService --outputDirectory ./srv/util/types/entities
```

- Source folder : `./srv/controller/mainService` - Change to your location folder
- Target folder :`./srv/util/types/entities` - Change to your location folder

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Architecture

**We recommend adhering** to the **Controller-Service-Repository** design pattern using the following folder structure:

1. [EntityHandler](#entityhandler) - Manages the REST interface to the business logic [ServiceLogic](#servicelogic)
2. [ServiceLogic](#servicelogic) - Contains business logic implementations
3. [Repository](#repository) - Will contain manipulation of entities through the utilization of [CDS-QL](https://cap.cloud.sap/docs/node.js/cds-ql).
   - `[Optional enhancement]` To simplify `entity manipulation` using [CDS-QL](https://cap.cloud.sap/docs/node.js/cds-ql), a `BaseRepository` `npm package` was created for [CDS-QL](https://cap.cloud.sap/docs/node.js/cds-ql) of the most common `database actions` like `.create(...), findAll(), find(...), delete(...), exists() ...`

![Alt text](image.png) <= expanded folders => ![Alt text](image-1.png)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

### CDSDispatcher

**CDSDispatcher**(`entities` : `Constructable[]`)

The `CDSDispatcher` constructor allows you to create an instance for dispatching and managing entities.

`CDSDispatcher` class will initialize all **[Entity handler](#entityhandler)(s)** and all of their `Dependencies` : [Services](#servicelogic), [Repositories](#repository).

`Parameters`

- `entities (Array)`: An array of **[Entity handler](#entityhandler)(s)** classes (Constructable) that represent the different types of entities in the CDS.

`Example`

```typescript
module.exports = new CDSDispatcher([CustomerHandler, AddressHandler]).initializeEntityHandlers()
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Decorators

#### Class

##### EntityHandler

**@EntityHandler**(`entity`: CDSTyperEntity)

The `@EntityHandler` decorator is utilized at the `class-level` to annotate a class with the specific `entity` that will be used in all handlers.

`Parameters`

- `entity (CDSTyperEntity)`: A specialized class generated using the [CDS-Typer](#generate-cds-typed-entities).
  - `MyEntity` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Example`

```typescript
@EntityHandler(MyEntity)
class CustomerHandler {
  ...
  constructor() {}
  ...
```

> Note @EntityHandler class should contain only handling of the `REST operations`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### ServiceLogic

**@ServiceLogic()**

The `@ServiceLogic` decorator is utilized at the `class-level` to annotate a `class` as a specialized `ServiceLogic`.

When applying `ServiceLogic` decorator, the class becomes eligible to be used with [Inject](#inject) decorator for `Dependency injection`

`Example`

```typescript
@ServiceLogic()
class CustomerService {
  ...
  constructor() {}
  ...
```

> Note @ServiceLogic class should contain only `business logic`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### Repository

**@Repository()**

The `@Repository` decorator is utilized as a `class-level` annotation that designates a particular `class` as a specialized `Repository`.

When applying `Repository` decorator, the class becomes eligible to be used with [Inject](#inject) decorator for `Dependency injection`

```typescript
@Repository()
class CustomerRepository {
  ...
  constructor() {}
  ...
```

###### Optional BaseRepository

The goal of SAP CAP **[CDS-QL](https://cap.cloud.sap/docs/node.js/cds-ql)** **BaseRepository** is to significantly reduce the boilerplate code required to implement data access layers for persistance entities by providing out of the box actions on the `database` such as `.create(...), findAll(), , find(...), delete(...), exists() ...`

`Example`

```typescript
@Repository()
class CustomerRepository extends BaseRepository<MyEntity> {
  constructor() {
    super(MyEntity)
  }
}
```

> Note @Repository class should be exclusively responsible for managing `interactions between the database and service layers`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### Fields

##### Inject

**@Inject**(`serviceIdentifier: ServiceIdentifierOrFunc<unknown>`) `private / public / protected` `NAME_OF_CLASS` : `TYPE_OF_CLASS`

The `@Inject` decorator is utilized as a `field-level` decorator and allows you to inject dependencies into your classes or components.

`Parameters`

- `serviceIdentifier(Function or Symbol)`: A function or a symbol representing the service to inject.
  - `MyEntity` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Example`

```typescript
@EntityHandler(MyEntity)
class CustomerHandler {
  ...
  @Inject(CustomerService) private customerService: CustomerService
  @Inject(ServiceHelper.SRV) private srv: CdsService
  ...
  constructor() {}
  ...
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### Inject SRV

**@Inject**(`ServiceHelper.SRV`) `private srv: CdsService`

This specialized `@Inject` can be used as a `constant` in `@ServiceLogic, @Repository and @EntityHandler` class, the `private srv` can be accessed trough `this.srv` and contains the `CDS srv` for further enhancements.

`Example`

```typescript
@EntityHandler(MyEntity)
// OR @ServiceLogic()
// OR @Repository()
class CustomerHandler { // OR CustomerService, CustomerRepository
  ...
  @Inject(ServiceHelper.SRV) private srv: CdsService
  ...
  constructor() {}
  ...
```

`MyEntity` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### Methods

##### Before

Use `@BeforeCreate(), @BeforeRead(), @BeforeUpdate(), @BeforeDelete(), BeforeAction()` to register handlers to run before `.on` handlers, frequently used for `validating user input.`

The handlers receive one argument:

- `req` of type `Request`

See JS **[CDS-Before](https://cap.cloud.sap/docs/node.js/core-services#srv-before-request) event**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

###### BeforeCreate

**@BeforeCreate**()

It is important to note that decorator `@BeforeCreate()` will use always point to [EntityHandler](#entityhandler) `argument` => `MyEntity` which represents a generated `CDS entity`.

- `MyEntity` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Example`

```typescript
@BeforeCreate()
public async beforeCreateMethod(req: Request) {
   return this.customerService.testExample( req)
}
```

`Equivalent to 'JS'`

```typescript
this.before('CREATE', MyEntity, async (req: Request) => {
  return this.customerService.testExample(req)
})
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

###### BeforeRead

**@BeforeRead**()

It is important to note that decorator `@BeforeRead()` will use always point to [EntityHandler](#entityhandler) `argument` => `MyEntity` which represents a generated `CDS entity`.

- `MyEntity` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Example`

```typescript
@BeforeRead()
public async beforeReadMethod(req: Request) {
   return this.customerService.testExample( req)
}
```

`Equivalent to 'JS'`

```typescript
this.before('READ', MyEntity, async (req: Request) => {
  return this.customerService.testExample(req)
})
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

###### BeforeUpdate

**@BeforeUpdate**()

It is important to note that decorator `@BeforeUpdate()` will use always point to [EntityHandler](#entityhandler) `argument` => `MyEntity` which represents a generated `CDS entity`.

- `MyEntity` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Example`

```typescript
@BeforeUpdate()
public async beforeUpdateMethod(req: Request) {
   return this.customerService.testExample( req)
}
```

`Equivalent to 'JS'`

```typescript
this.before('UPDATE', MyEntity, async (req: Request) => {
  return this.customerService.testExample(req)
})
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

###### BeforeDelete

**@BeforeDelete**()

It is important to note that decorator `@BeforeDelete()` will use always point to [EntityHandler](#entityhandler) `argument` => `MyEntity` which represents a generated `CDS entity`.

- `MyEntity` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Example`

```typescript
@BeforeDelete()
public async beforeDeleteMethod(req: Request) {
   return this.customerService.testExample(req)
}
```

`Equivalent to 'JS'`

```typescript
this.before('DELETE', MyEntity, async (req: Request) => {
  return this.customerService.testExample(req)
})
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### After

Use `@AfterCreate(), @AfterRead(), @AfterUpdate(), @AfterDelete(), AfterAction()` register handlers to run after the `.on` handlers, frequently used to `enrich outbound data.` The handlers receive two arguments:

- `results` of type **`MyEntity[]`** — the outcomes of the `.on` handler which ran before
- `req` of type `Request`

See JS **[CDS-After](https://cap.cloud.sap/docs/node.js/core-services#srv-after-request) event**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

###### AfterCreate

**@AfterCreate**()

It is important to note that decorator `@AfterCreate()` will use always point to [EntityHandler](#entityhandler) `argument` => `MyEntity` which represents a generated `CDS entity`.

- `MyEntity` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Example`

```typescript
@AfterCreate()
public async afterCreateMethod(results : MyEntity[], req: Request) {
   return this.customerService.testExample( req)
}
```

`Equivalent to 'JS'`

```typescript
this.after('CREATE', MyEntity, async (req: Request) => {
  return this.customerService.testExample(req)
})
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

###### AfterRead

**@AfterRead**()

`Example`

It is important to note that decorator `@AfterRead()` will use always point to [EntityHandler](#entityhandler) `argument` => `MyEntity` which represents a generated `CDS entity`.

- `MyEntity` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

```typescript
@AfterRead()
public async afterReadMethod(req: Request) {
   return this.customerService.testExample( req)
}
```

`Equivalent to 'JS'`

```typescript
this.after('READ', MyEntity, async (req: Request) => {
  return this.customerService.testExample(req)
})
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

###### AfterUpdate

**@AfterUpdate**()

It is important to note that decorator `@AfterUpdate()` will use always point to [EntityHandler](#entityhandler) `argument` => `MyEntity` which represents a generated `CDS entity`.

- `MyEntity` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Example`

```typescript
@AfterUpdate()
public async afterUpdateMethod(req: Request) {
   return this.customerService.testExample( req)
}
```

`Equivalent to 'JS'`

```typescript
this.after('UPDATE', MyEntity, async (req: Request) => {
  return this.customerService.testExample(req)
})
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

###### AfterDelete

**@AfterDelete**()

It is important to note that decorator `@AfterDelete()` will use always point to [EntityHandler](#entityhandler) `argument` => `MyEntity` which represents a generated `CDS entity`.

- `MyEntity` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Example`

```typescript
@AfterDelete()
public async afterDeleteMethod(req: Request) {
   return this.customerService.testExample( req)
}
```

`Equivalent to 'JS'`

```typescript
this.after('DELETE', MyEntity, async (req: Request) => {
  return this.customerService.testExample(req)
})
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### On

Use `@OnCreate(), @OnRead(), @OnUpdate(), @OnDelete(), OnAction(), @OnFunction()` handlers to fulfill requests, e.g. by reading/writing data from/to databases handlers.

The handlers receive one argument:

- `req` of type `Request`
- `next` of type `Function`

See JS **[CDS-On](https://cap.cloud.sap/docs/node.js/core-services#srv-on-request) event**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

###### OnCreate

**@OnCreate**()

It is important to note that decorator `@OnCreate()` will use always point to [EntityHandler](#entityhandler) `argument` => `MyEntity` which represents a generated `CDS entity`.

- `MyEntity` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Example`

```typescript
@OnCreate()
public async onCreateMethod(req: Request, next : Function) {
   return this.customerService.testExample( req)
}
```

`Equivalent to 'JS'`

```typescript
this.on('CREATE', MyEntity, async (req: Request, next: Function) => {
  return this.customerService.testExample(req)
})
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

###### OnRead

**@OnRead**()

It is important to note that decorator `@OnRead()` will use always point to [EntityHandler](#entityhandler) `argument` => `MyEntity` which represents a generated `CDS entity`.

- `MyEntity` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Example`

```typescript
@OnRead()
public async onReadMethod(req: Request, next : Function) {
   return this.customerService.testExample(req)
}
```

`Equivalent to 'JS'`

```typescript
this.on('READ', MyEntity, async (req: Request, next: Function) => {
  return this.customerService.testExample(req)
})
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

###### OnUpdate

**@OnUpdate**()

It is important to note that decorator `@OnUpdate()` will use always point to [EntityHandler](#entityhandler) `argument` => `MyEntity` which represents a generated `CDS entity`.

- `MyEntity` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Example`

```typescript
@OnUpdate()
public async onUpdateMethod(req: Request, next : Function) {
   return this.customerService.testExample(req)
}
```

`Equivalent to 'JS'`

```typescript
this.on('UPDATE', MyEntity, async (req: Request, next: Function) => {
  return this.customerService.testExample(req)
})
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

###### OnDelete

**@OnDelete**()

It is important to note that decorator `@OnDelete()` will use always point to [EntityHandler](#entityhandler) `argument` => `MyEntity` which represents a generated `CDS entity`.

- `MyEntity` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Example`

```typescript
@OnDelete()
public async onDeleteMethod(req: Request, next : Function) {
   return this.customerService.testExample( req)
}
```

`Equivalent to 'JS'`

```typescript
this.on('DELETE', MyEntity, async (req: Request, next: Function) => {
  return this.customerService.testExample(req)
})
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

###### OnAction

**@OnAction**(`name` : CDSTyperAction)

`Parameters`

- `name (CDSTyperAction)` : Representing the `CDS action` defined in the `CDS file`, generated using the [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Example`

```typescript
@OnAction(AnActionOrFunction)
public async onActionMethod(req: Request, next : Function) {
   return this.customerService.testExample( req)
}
```

`Equivalent to 'JS'`

```typescript
this.on(AnActionOrFunction, async (req: Request, next: Function) => {
  return this.customerService.testExample(req)
})
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

###### OnFunction

**@OnFunction**(`name` : CDSTyperAction)

`Parameters`

- `name (CDSTyperAction)` : Representing the `CDS action` defined in the `CDS file`, generated using the [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Example`

```typescript
@OnFunction(AnActionOrFunction)
public async onFunctionMethod(req: Request, next : Function) {
   return this.customerService.testExample(req)
}
```

`Equivalent to 'JS'`

```typescript
this.on(AnActionOrFunction, async (req: Request) => {
  return this.customerService.testExample(req)
})
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

###### OnBoundAction

**@OnBoundAction**(`name` : CDSTyperAction)

It is important to note that decorator `@OnBoundAction()` will use always point to [EntityHandler](#entityhandler) `argument` => `MyEntity` which represents a generated `CDS entity`.

- `MyEntity` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Parameters`

- `name (CDSTyperAction)` : Representing the `CDS action` defined in the `CDS file`, generated using the [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Example`

```typescript
@OnBoundAction(AnActionMethod)
public async onActionMethod(req: Request, next : Function) {
   return this.customerService.testExample(req)
}
```

`Equivalent to 'JS'`

```typescript
this.on(AnActionMethod, MyEntity, async (req: Request) => {
  return this.customerService.testExample(req)
})
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

###### OnBoundFunction

**@OnBoundFunction**(`name` : CDSTyperAction)

It is important to note that decorator `@OnBoundFunction()` will use always point to [EntityHandler](#entityhandler) `argument` => `MyEntity` which represents a generated `CDS entity`.

- `MyEntity` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Parameters`

- `name (CDSTyperAction)` : Representing the `CDS action` defined in the `CDS file`, generated using the [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Example`

```typescript
@OnBoundFunction(aCdsFunctionMethod)
public async onFunctionMethod(req: Request, next : Function) {
   return this.customerService.testExample(req)
}
```

`Equivalent to 'JS'`

```typescript
this.on(aCdsFunctionMethod, MyEntity, async (req: Request) => {
  return this.customerService.testExample(req)
})
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### Fiori draft

Use `@OnNewDraft(), @OnCancelDraft(), @OnEditDraft(), OnSaveDraft()` handlers to support for both, `active and draft entities`.

The handlers receive one argument:

- `req` of type `Request`

- `MyEntity.drafts` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.
- `MyEntity` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

For more info about visit **[CDS-Fiori-draft](https://cap.cloud.sap/docs/node.js/fiori#draft-support)**

###### Draft

**@Draft()**

The `@Draft()` decorator is utilized at the `method-level` to annotate a method that this method and all decorators which are used along with this `Draft()` decorator, will be marked as a `Draft`.

`Important`

When utilizing the `@Draft()` decorator, the `placement of the @Draft() decorator` within your TypeScript class is very important factor to consider. It determines the scope of the `draft` mode within the methods that precede it.

`Example 1`

```typescript
@AfterUpdate() // Will be marked as draft
@AfterCreate() // Will be marked as draft
@AfterRead() // Will be marked as draft
@Draft() // All methods above '@Draft()' will be have 'draft' scope.
public async draftMethod(results : MyEntity[], req: Request) {
   return this.customerService.testExample( req)
}
```

`Equivalent to 'JS'`

```typescript
this.after(['UPDATE, CREATE, READ'], MyEntity.drafts, async (req: Request) => {
  return this.customerService.testExample(req)
})
```

`Example 2`

When using `@Draft()` in-between other `Decorators`. The above decorators of the `@Draft()` will be placed `only as Draft`.
The rest `Decorators` below `@Draft()` will be work on active entities.

```typescript
@AfterUpdate() // Marked as a draft
@Draft() // Draft is in-between 'after', this means that only '@AfterUpdate' will me marked as draft
@AfterCreate() // Will work on active entity
@AfterRead() // Will work on active entity
public async draftMethodAndNonDraft(req: Request) {
   return this.customerService.testExample( req)
}
```

`Equivalent to 'JS'`

```typescript
// FOR DRAFT
this.after('UPDATE', MyEntity.drafts, async (req: Request) => {
  return this.customerService.testExample(req)
})

// FOR ACTIVE ENTITIES
this.after(['CREATE', 'READ'], MyEntity, async (req: Request) => {
  return this.customerService.testExample(req)
})
```

`Example 3`

`Alternative to all above is to split between` `@Draft` and `Active entities`.

```typescript
@BeforeUpdate()
@BeforeCreate()
@AfterRead()
@Draft() // All above decorators will be marked AS DRAFT
public async draftMethod(req: Request) {
   return this.customerService.testExample( req)
}

// All decorators will work only FOR ACTIVE ENTITIES
@BeforeUpdate()
@BeforeCreate()
@AfterRead()
public async methodWithoutDraft(req: Request) {
   return this.customerService.testExample( req)
}
```

`Equivalent to 'JS'`

```typescript
// FOR DRAFT
this.before(['UPDATE', 'CREATE'], MyEntity.drafts, async (req: Request) => {
  return this.customerService.testExample(req)
})

// FOR DRAFT
this.after('READ', MyEntity.drafts, async (req: Request) => {
  return this.customerService.testExample(req)
})

// FOR ACTIVE ENTITIES
this.before(['UPDATE', 'CREATE'], MyEntity, async (req: Request) => {
  return this.customerService.testExample(req)
})

this.after('READ', MyEntity, async (req: Request) => {
  return this.customerService.testExample(req)
})
```

###### OnNewDraft

**@OnNewDraft()**

This decorator will be triggered when `a new draft is created`.

It is important to note that decorator `@OnCancelDraft()` will use always point to [EntityHandler](#entityhandler) `argument` => `MyEntity.drafts` which represents a generated `CDS entity`.

- `MyEntity.drafts` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Example`

```typescript
@OnNewDraft()
public async onNewDraft(req: Request) {
   return this.customerService.testExample( req)
}
```

`Equivalent to 'JS'`

```typescript
this.on('NEW', MyEntity.drafts, async (req: Request) => {
  return this.customerService.testExample(req)
})
```

###### OnCancelDraft

**@OnCancelDraft()**

This decorator will be triggered when `a draft is cancelled`.

It is important to note that decorator `@OnCancelDraft()` will use always point to [EntityHandler](#entityhandler) `argument` => `MyEntity.drafts` which represents a generated `CDS entity`.

- `MyEntity.drafts` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Example`

```typescript
@OnCancelDraft()
public async onCancelDraft(req: Request) {
   return this.customerService.testExample( req)
}
```

`Equivalent to 'JS'`

```typescript
this.on('CANCEL', MyEntity.drafts, async (req: Request) => {
  return this.customerService.testExample(req)
})
```

###### OnEditDraft

**@OnEditDraft()**

This decorator will be triggered when `a new draft is created from an active instance`

It is important to note that decorator `@OnEditDraft()` will use always point to [EntityHandler](#entityhandler) `argument` => `MyEntity` which represents a generated `CDS entity`.

- `MyEntity` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Example`

```typescript
@OnEditDraft()
public async onEditDraft(req: Request) {
   return this.customerService.testExample( req)
}
```

`Equivalent to 'JS'`

```typescript
this.on('EDIT', MyEntity, async (req: Request) => {
  return this.customerService.testExample(req)
})
```

###### OnSaveDraft

**@OnSaveDraft()**

This decorator will be triggered when `the active entity is changed`

It is important to note that decorator `@OnSaveDraft()` will use always point to [EntityHandler](#entityhandler) `argument` => `MyEntity` which represents a generated `CDS entity`.

- `MyEntity` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Example`

```typescript
@OnSaveDraft()
public async onSaveDraft(req: Request) {
   return this.customerService.testExample( req)
}
```

`Equivalent to 'JS'`

```typescript
this.on('SAVE', MyEntity, async (req: Request) => {
  return this.customerService.testExample(req)
})
```

###### OnBoundActionDraft

**@OnBoundActionDraft()**

This decorator will be triggered when `the draft will be triggered`

It is important to note that decorator `@OnBoundActionDraft()` will use always point to [EntityHandler](#entityhandler) `argument` => `MyEntity.drafts` which represents a generated `CDS entity`.

- `MyEntity.drafts` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Example`

```typescript
@OnBoundActionDraft(aBoundDraftAction)
public async onBoundActionDraft(req: Request) {
   return this.customerService.testExample( req)
}
```

`Equivalent to 'JS'`

```typescript
this.on(AnActionDraftMethod, MyEntity.drafts, async (req: Request, next: Function) => {
  return this.customerService.testExample(req)
})
```

###### OnBoundFunctionDraft

**@OnBoundFunctionDraft()**

This decorator will be triggered when `the draft will be triggered`

It is important to note that decorator `@OnBoundFunctionDraft()` will use always point to [EntityHandler](#entityhandler) `argument` => `MyEntity.drafts` which represents a generated `CDS entity`.

- `MyEntity.drafts` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Example`

```typescript
@OnBoundFunctionDraft(aBoundDraftFunction)
public async onBoundActionDraft(req: Request) {
   return this.customerService.testExample( req)
}
```

`Equivalent to 'JS'`

```typescript
this.on(aFunctionDraftMethod, MyEntity.drafts, async (req: Request, next: Function) => {
  return this.customerService.testExample(req)
})
```

### Example

TODO

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[![Licence](https://img.shields.io/github/license/Ileriayo/markdown-badges?style=for-the-badge)](https://choosealicense.com/licenses/mit/)

## Authors

- [@dragolea](https://github.com/dragolea)
- [@sblessing](https://github.com/sblessing)
- [@ABS GmbH](https://www.abs-gmbh.de/) team

<p align="right">(<a href="#readme-top">back to top</a>)</p>
