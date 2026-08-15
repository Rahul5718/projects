# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetUser*](#getuser)
  - [*ListUsers*](#listusers)
  - [*GetJob*](#getjob)
  - [*ListJobs*](#listjobs)
  - [*GetCategory*](#getcategory)
  - [*ListCategories*](#listcategories)
  - [*GetStudyMaterial*](#getstudymaterial)
  - [*ListStudyMaterials*](#liststudymaterials)
  - [*GetProgress*](#getprogress)
  - [*ListProgresses*](#listprogresses)
  - [*ListSavedJobs*](#listsavedjobs)
  - [*ListSavedMaterials*](#listsavedmaterials)
  - [*ListApplications*](#listapplications)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*UpdateUser*](#updateuser)
  - [*DeleteUser*](#deleteuser)
  - [*CreateJob*](#createjob)
  - [*UpdateJob*](#updatejob)
  - [*DeleteJob*](#deletejob)
  - [*CreateCategory*](#createcategory)
  - [*UpdateCategory*](#updatecategory)
  - [*DeleteCategory*](#deletecategory)
  - [*CreateStudyMaterial*](#createstudymaterial)
  - [*UpdateStudyMaterial*](#updatestudymaterial)
  - [*DeleteStudyMaterial*](#deletestudymaterial)
  - [*CreateProgress*](#createprogress)
  - [*UpdateProgress*](#updateprogress)
  - [*DeleteProgress*](#deleteprogress)
  - [*SaveJob*](#savejob)
  - [*DeleteSavedJob*](#deletesavedjob)
  - [*SaveMaterial*](#savematerial)
  - [*DeleteSavedMaterial*](#deletesavedmaterial)
  - [*ApplyForJob*](#applyforjob)
  - [*DeleteApplication*](#deleteapplication)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetUser
You can execute the `GetUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUser(vars: GetUserVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserData, GetUserVariables>;

interface GetUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserVariables): QueryRef<GetUserData, GetUserVariables>;
}
export const getUserRef: GetUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUser(dc: DataConnect, vars: GetUserVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserData, GetUserVariables>;

interface GetUserRef {
  ...
  (dc: DataConnect, vars: GetUserVariables): QueryRef<GetUserData, GetUserVariables>;
}
export const getUserRef: GetUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserRef:
```typescript
const name = getUserRef.operationName;
console.log(name);
```

### Variables
The `GetUser` query requires an argument of type `GetUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserData {
  user?: {
    email: string;
    fullName: string;
    role: string;
    bio?: string | null;
  };
}
```
### Using `GetUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUser, GetUserVariables } from '@dataconnect/generated';

// The `GetUser` query requires an argument of type `GetUserVariables`:
const getUserVars: GetUserVariables = {
  id: ..., 
};

// Call the `getUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUser(getUserVars);
// Variables can be defined inline as well.
const { data } = await getUser({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUser(dataConnect, getUserVars);

console.log(data.user);

// Or, you can use the `Promise` API.
getUser(getUserVars).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserRef, GetUserVariables } from '@dataconnect/generated';

// The `GetUser` query requires an argument of type `GetUserVariables`:
const getUserVars: GetUserVariables = {
  id: ..., 
};

// Call the `getUserRef()` function to get a reference to the query.
const ref = getUserRef(getUserVars);
// Variables can be defined inline as well.
const ref = getUserRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserRef(dataConnect, getUserVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListUsers
You can execute the `ListUsers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listUsers(options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface ListUsersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUsersData, undefined>;
}
export const listUsersRef: ListUsersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface ListUsersRef {
  ...
  (dc: DataConnect): QueryRef<ListUsersData, undefined>;
}
export const listUsersRef: ListUsersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listUsersRef:
```typescript
const name = listUsersRef.operationName;
console.log(name);
```

### Variables
The `ListUsers` query has no variables.
### Return Type
Recall that executing the `ListUsers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUsersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListUsersData {
  users: ({
    email: string;
    fullName: string;
  })[];
}
```
### Using `ListUsers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listUsers } from '@dataconnect/generated';


// Call the `listUsers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUsers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUsers(dataConnect);

console.log(data.users);

// Or, you can use the `Promise` API.
listUsers().then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `ListUsers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listUsersRef } from '@dataconnect/generated';


// Call the `listUsersRef()` function to get a reference to the query.
const ref = listUsersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUsersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## GetJob
You can execute the `GetJob` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getJob(vars: GetJobVariables, options?: ExecuteQueryOptions): QueryPromise<GetJobData, GetJobVariables>;

interface GetJobRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetJobVariables): QueryRef<GetJobData, GetJobVariables>;
}
export const getJobRef: GetJobRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getJob(dc: DataConnect, vars: GetJobVariables, options?: ExecuteQueryOptions): QueryPromise<GetJobData, GetJobVariables>;

interface GetJobRef {
  ...
  (dc: DataConnect, vars: GetJobVariables): QueryRef<GetJobData, GetJobVariables>;
}
export const getJobRef: GetJobRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getJobRef:
```typescript
const name = getJobRef.operationName;
console.log(name);
```

### Variables
The `GetJob` query requires an argument of type `GetJobVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetJobVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetJob` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetJobData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetJobData {
  job?: {
    title: string;
    company: string;
    description: string;
  };
}
```
### Using `GetJob`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getJob, GetJobVariables } from '@dataconnect/generated';

// The `GetJob` query requires an argument of type `GetJobVariables`:
const getJobVars: GetJobVariables = {
  id: ..., 
};

// Call the `getJob()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getJob(getJobVars);
// Variables can be defined inline as well.
const { data } = await getJob({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getJob(dataConnect, getJobVars);

console.log(data.job);

// Or, you can use the `Promise` API.
getJob(getJobVars).then((response) => {
  const data = response.data;
  console.log(data.job);
});
```

### Using `GetJob`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getJobRef, GetJobVariables } from '@dataconnect/generated';

// The `GetJob` query requires an argument of type `GetJobVariables`:
const getJobVars: GetJobVariables = {
  id: ..., 
};

// Call the `getJobRef()` function to get a reference to the query.
const ref = getJobRef(getJobVars);
// Variables can be defined inline as well.
const ref = getJobRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getJobRef(dataConnect, getJobVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.job);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.job);
});
```

## ListJobs
You can execute the `ListJobs` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listJobs(options?: ExecuteQueryOptions): QueryPromise<ListJobsData, undefined>;

interface ListJobsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListJobsData, undefined>;
}
export const listJobsRef: ListJobsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listJobs(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListJobsData, undefined>;

interface ListJobsRef {
  ...
  (dc: DataConnect): QueryRef<ListJobsData, undefined>;
}
export const listJobsRef: ListJobsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listJobsRef:
```typescript
const name = listJobsRef.operationName;
console.log(name);
```

### Variables
The `ListJobs` query has no variables.
### Return Type
Recall that executing the `ListJobs` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListJobsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListJobsData {
  jobs: ({
    title: string;
    company: string;
  })[];
}
```
### Using `ListJobs`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listJobs } from '@dataconnect/generated';


// Call the `listJobs()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listJobs();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listJobs(dataConnect);

console.log(data.jobs);

// Or, you can use the `Promise` API.
listJobs().then((response) => {
  const data = response.data;
  console.log(data.jobs);
});
```

### Using `ListJobs`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listJobsRef } from '@dataconnect/generated';


// Call the `listJobsRef()` function to get a reference to the query.
const ref = listJobsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listJobsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.jobs);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.jobs);
});
```

## GetCategory
You can execute the `GetCategory` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getCategory(vars: GetCategoryVariables, options?: ExecuteQueryOptions): QueryPromise<GetCategoryData, GetCategoryVariables>;

interface GetCategoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCategoryVariables): QueryRef<GetCategoryData, GetCategoryVariables>;
}
export const getCategoryRef: GetCategoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCategory(dc: DataConnect, vars: GetCategoryVariables, options?: ExecuteQueryOptions): QueryPromise<GetCategoryData, GetCategoryVariables>;

interface GetCategoryRef {
  ...
  (dc: DataConnect, vars: GetCategoryVariables): QueryRef<GetCategoryData, GetCategoryVariables>;
}
export const getCategoryRef: GetCategoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCategoryRef:
```typescript
const name = getCategoryRef.operationName;
console.log(name);
```

### Variables
The `GetCategory` query requires an argument of type `GetCategoryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetCategoryVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetCategory` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCategoryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetCategoryData {
  category?: {
    name: string;
  };
}
```
### Using `GetCategory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCategory, GetCategoryVariables } from '@dataconnect/generated';

// The `GetCategory` query requires an argument of type `GetCategoryVariables`:
const getCategoryVars: GetCategoryVariables = {
  id: ..., 
};

// Call the `getCategory()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCategory(getCategoryVars);
// Variables can be defined inline as well.
const { data } = await getCategory({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCategory(dataConnect, getCategoryVars);

console.log(data.category);

// Or, you can use the `Promise` API.
getCategory(getCategoryVars).then((response) => {
  const data = response.data;
  console.log(data.category);
});
```

### Using `GetCategory`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCategoryRef, GetCategoryVariables } from '@dataconnect/generated';

// The `GetCategory` query requires an argument of type `GetCategoryVariables`:
const getCategoryVars: GetCategoryVariables = {
  id: ..., 
};

// Call the `getCategoryRef()` function to get a reference to the query.
const ref = getCategoryRef(getCategoryVars);
// Variables can be defined inline as well.
const ref = getCategoryRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCategoryRef(dataConnect, getCategoryVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.category);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.category);
});
```

## ListCategories
You can execute the `ListCategories` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listCategories(options?: ExecuteQueryOptions): QueryPromise<ListCategoriesData, undefined>;

interface ListCategoriesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCategoriesData, undefined>;
}
export const listCategoriesRef: ListCategoriesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCategories(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListCategoriesData, undefined>;

interface ListCategoriesRef {
  ...
  (dc: DataConnect): QueryRef<ListCategoriesData, undefined>;
}
export const listCategoriesRef: ListCategoriesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCategoriesRef:
```typescript
const name = listCategoriesRef.operationName;
console.log(name);
```

### Variables
The `ListCategories` query has no variables.
### Return Type
Recall that executing the `ListCategories` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCategoriesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListCategoriesData {
  categories: ({
    name: string;
  })[];
}
```
### Using `ListCategories`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCategories } from '@dataconnect/generated';


// Call the `listCategories()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCategories();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCategories(dataConnect);

console.log(data.categories);

// Or, you can use the `Promise` API.
listCategories().then((response) => {
  const data = response.data;
  console.log(data.categories);
});
```

### Using `ListCategories`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCategoriesRef } from '@dataconnect/generated';


// Call the `listCategoriesRef()` function to get a reference to the query.
const ref = listCategoriesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCategoriesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.categories);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.categories);
});
```

## GetStudyMaterial
You can execute the `GetStudyMaterial` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getStudyMaterial(vars: GetStudyMaterialVariables, options?: ExecuteQueryOptions): QueryPromise<GetStudyMaterialData, GetStudyMaterialVariables>;

interface GetStudyMaterialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetStudyMaterialVariables): QueryRef<GetStudyMaterialData, GetStudyMaterialVariables>;
}
export const getStudyMaterialRef: GetStudyMaterialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getStudyMaterial(dc: DataConnect, vars: GetStudyMaterialVariables, options?: ExecuteQueryOptions): QueryPromise<GetStudyMaterialData, GetStudyMaterialVariables>;

interface GetStudyMaterialRef {
  ...
  (dc: DataConnect, vars: GetStudyMaterialVariables): QueryRef<GetStudyMaterialData, GetStudyMaterialVariables>;
}
export const getStudyMaterialRef: GetStudyMaterialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getStudyMaterialRef:
```typescript
const name = getStudyMaterialRef.operationName;
console.log(name);
```

### Variables
The `GetStudyMaterial` query requires an argument of type `GetStudyMaterialVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetStudyMaterialVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetStudyMaterial` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetStudyMaterialData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetStudyMaterialData {
  studyMaterial?: {
    title: string;
    contentType: string;
  };
}
```
### Using `GetStudyMaterial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getStudyMaterial, GetStudyMaterialVariables } from '@dataconnect/generated';

// The `GetStudyMaterial` query requires an argument of type `GetStudyMaterialVariables`:
const getStudyMaterialVars: GetStudyMaterialVariables = {
  id: ..., 
};

// Call the `getStudyMaterial()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getStudyMaterial(getStudyMaterialVars);
// Variables can be defined inline as well.
const { data } = await getStudyMaterial({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getStudyMaterial(dataConnect, getStudyMaterialVars);

console.log(data.studyMaterial);

// Or, you can use the `Promise` API.
getStudyMaterial(getStudyMaterialVars).then((response) => {
  const data = response.data;
  console.log(data.studyMaterial);
});
```

### Using `GetStudyMaterial`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getStudyMaterialRef, GetStudyMaterialVariables } from '@dataconnect/generated';

// The `GetStudyMaterial` query requires an argument of type `GetStudyMaterialVariables`:
const getStudyMaterialVars: GetStudyMaterialVariables = {
  id: ..., 
};

// Call the `getStudyMaterialRef()` function to get a reference to the query.
const ref = getStudyMaterialRef(getStudyMaterialVars);
// Variables can be defined inline as well.
const ref = getStudyMaterialRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getStudyMaterialRef(dataConnect, getStudyMaterialVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.studyMaterial);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.studyMaterial);
});
```

## ListStudyMaterials
You can execute the `ListStudyMaterials` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listStudyMaterials(options?: ExecuteQueryOptions): QueryPromise<ListStudyMaterialsData, undefined>;

interface ListStudyMaterialsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListStudyMaterialsData, undefined>;
}
export const listStudyMaterialsRef: ListStudyMaterialsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listStudyMaterials(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListStudyMaterialsData, undefined>;

interface ListStudyMaterialsRef {
  ...
  (dc: DataConnect): QueryRef<ListStudyMaterialsData, undefined>;
}
export const listStudyMaterialsRef: ListStudyMaterialsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listStudyMaterialsRef:
```typescript
const name = listStudyMaterialsRef.operationName;
console.log(name);
```

### Variables
The `ListStudyMaterials` query has no variables.
### Return Type
Recall that executing the `ListStudyMaterials` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListStudyMaterialsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListStudyMaterialsData {
  studyMaterials: ({
    title: string;
    contentType: string;
  })[];
}
```
### Using `ListStudyMaterials`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listStudyMaterials } from '@dataconnect/generated';


// Call the `listStudyMaterials()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listStudyMaterials();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listStudyMaterials(dataConnect);

console.log(data.studyMaterials);

// Or, you can use the `Promise` API.
listStudyMaterials().then((response) => {
  const data = response.data;
  console.log(data.studyMaterials);
});
```

### Using `ListStudyMaterials`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listStudyMaterialsRef } from '@dataconnect/generated';


// Call the `listStudyMaterialsRef()` function to get a reference to the query.
const ref = listStudyMaterialsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listStudyMaterialsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.studyMaterials);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.studyMaterials);
});
```

## GetProgress
You can execute the `GetProgress` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getProgress(vars: GetProgressVariables, options?: ExecuteQueryOptions): QueryPromise<GetProgressData, GetProgressVariables>;

interface GetProgressRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetProgressVariables): QueryRef<GetProgressData, GetProgressVariables>;
}
export const getProgressRef: GetProgressRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getProgress(dc: DataConnect, vars: GetProgressVariables, options?: ExecuteQueryOptions): QueryPromise<GetProgressData, GetProgressVariables>;

interface GetProgressRef {
  ...
  (dc: DataConnect, vars: GetProgressVariables): QueryRef<GetProgressData, GetProgressVariables>;
}
export const getProgressRef: GetProgressRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getProgressRef:
```typescript
const name = getProgressRef.operationName;
console.log(name);
```

### Variables
The `GetProgress` query requires an argument of type `GetProgressVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetProgressVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetProgress` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetProgressData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetProgressData {
  progress?: {
    status: string;
    lastAccessedDate?: TimestampString | null;
  };
}
```
### Using `GetProgress`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getProgress, GetProgressVariables } from '@dataconnect/generated';

// The `GetProgress` query requires an argument of type `GetProgressVariables`:
const getProgressVars: GetProgressVariables = {
  id: ..., 
};

// Call the `getProgress()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getProgress(getProgressVars);
// Variables can be defined inline as well.
const { data } = await getProgress({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getProgress(dataConnect, getProgressVars);

console.log(data.progress);

// Or, you can use the `Promise` API.
getProgress(getProgressVars).then((response) => {
  const data = response.data;
  console.log(data.progress);
});
```

### Using `GetProgress`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getProgressRef, GetProgressVariables } from '@dataconnect/generated';

// The `GetProgress` query requires an argument of type `GetProgressVariables`:
const getProgressVars: GetProgressVariables = {
  id: ..., 
};

// Call the `getProgressRef()` function to get a reference to the query.
const ref = getProgressRef(getProgressVars);
// Variables can be defined inline as well.
const ref = getProgressRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getProgressRef(dataConnect, getProgressVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.progress);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.progress);
});
```

## ListProgresses
You can execute the `ListProgresses` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listProgresses(options?: ExecuteQueryOptions): QueryPromise<ListProgressesData, undefined>;

interface ListProgressesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListProgressesData, undefined>;
}
export const listProgressesRef: ListProgressesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listProgresses(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListProgressesData, undefined>;

interface ListProgressesRef {
  ...
  (dc: DataConnect): QueryRef<ListProgressesData, undefined>;
}
export const listProgressesRef: ListProgressesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listProgressesRef:
```typescript
const name = listProgressesRef.operationName;
console.log(name);
```

### Variables
The `ListProgresses` query has no variables.
### Return Type
Recall that executing the `ListProgresses` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListProgressesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListProgressesData {
  progresses: ({
    status: string;
  })[];
}
```
### Using `ListProgresses`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listProgresses } from '@dataconnect/generated';


// Call the `listProgresses()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listProgresses();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listProgresses(dataConnect);

console.log(data.progresses);

// Or, you can use the `Promise` API.
listProgresses().then((response) => {
  const data = response.data;
  console.log(data.progresses);
});
```

### Using `ListProgresses`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listProgressesRef } from '@dataconnect/generated';


// Call the `listProgressesRef()` function to get a reference to the query.
const ref = listProgressesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listProgressesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.progresses);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.progresses);
});
```

## ListSavedJobs
You can execute the `ListSavedJobs` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listSavedJobs(options?: ExecuteQueryOptions): QueryPromise<ListSavedJobsData, undefined>;

interface ListSavedJobsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListSavedJobsData, undefined>;
}
export const listSavedJobsRef: ListSavedJobsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listSavedJobs(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListSavedJobsData, undefined>;

interface ListSavedJobsRef {
  ...
  (dc: DataConnect): QueryRef<ListSavedJobsData, undefined>;
}
export const listSavedJobsRef: ListSavedJobsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listSavedJobsRef:
```typescript
const name = listSavedJobsRef.operationName;
console.log(name);
```

### Variables
The `ListSavedJobs` query has no variables.
### Return Type
Recall that executing the `ListSavedJobs` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListSavedJobsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListSavedJobsData {
  savedJobs: ({
    job: {
      title: string;
    };
  })[];
}
```
### Using `ListSavedJobs`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listSavedJobs } from '@dataconnect/generated';


// Call the `listSavedJobs()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listSavedJobs();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listSavedJobs(dataConnect);

console.log(data.savedJobs);

// Or, you can use the `Promise` API.
listSavedJobs().then((response) => {
  const data = response.data;
  console.log(data.savedJobs);
});
```

### Using `ListSavedJobs`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listSavedJobsRef } from '@dataconnect/generated';


// Call the `listSavedJobsRef()` function to get a reference to the query.
const ref = listSavedJobsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listSavedJobsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.savedJobs);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.savedJobs);
});
```

## ListSavedMaterials
You can execute the `ListSavedMaterials` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listSavedMaterials(options?: ExecuteQueryOptions): QueryPromise<ListSavedMaterialsData, undefined>;

interface ListSavedMaterialsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListSavedMaterialsData, undefined>;
}
export const listSavedMaterialsRef: ListSavedMaterialsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listSavedMaterials(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListSavedMaterialsData, undefined>;

interface ListSavedMaterialsRef {
  ...
  (dc: DataConnect): QueryRef<ListSavedMaterialsData, undefined>;
}
export const listSavedMaterialsRef: ListSavedMaterialsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listSavedMaterialsRef:
```typescript
const name = listSavedMaterialsRef.operationName;
console.log(name);
```

### Variables
The `ListSavedMaterials` query has no variables.
### Return Type
Recall that executing the `ListSavedMaterials` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListSavedMaterialsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListSavedMaterialsData {
  savedMaterials: ({
    studyMaterial: {
      title: string;
    };
  })[];
}
```
### Using `ListSavedMaterials`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listSavedMaterials } from '@dataconnect/generated';


// Call the `listSavedMaterials()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listSavedMaterials();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listSavedMaterials(dataConnect);

console.log(data.savedMaterials);

// Or, you can use the `Promise` API.
listSavedMaterials().then((response) => {
  const data = response.data;
  console.log(data.savedMaterials);
});
```

### Using `ListSavedMaterials`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listSavedMaterialsRef } from '@dataconnect/generated';


// Call the `listSavedMaterialsRef()` function to get a reference to the query.
const ref = listSavedMaterialsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listSavedMaterialsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.savedMaterials);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.savedMaterials);
});
```

## ListApplications
You can execute the `ListApplications` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listApplications(options?: ExecuteQueryOptions): QueryPromise<ListApplicationsData, undefined>;

interface ListApplicationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListApplicationsData, undefined>;
}
export const listApplicationsRef: ListApplicationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listApplications(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListApplicationsData, undefined>;

interface ListApplicationsRef {
  ...
  (dc: DataConnect): QueryRef<ListApplicationsData, undefined>;
}
export const listApplicationsRef: ListApplicationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listApplicationsRef:
```typescript
const name = listApplicationsRef.operationName;
console.log(name);
```

### Variables
The `ListApplications` query has no variables.
### Return Type
Recall that executing the `ListApplications` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListApplicationsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListApplicationsData {
  applications: ({
    status: string;
    job: {
      title: string;
    };
  })[];
}
```
### Using `ListApplications`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listApplications } from '@dataconnect/generated';


// Call the `listApplications()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listApplications();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listApplications(dataConnect);

console.log(data.applications);

// Or, you can use the `Promise` API.
listApplications().then((response) => {
  const data = response.data;
  console.log(data.applications);
});
```

### Using `ListApplications`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listApplicationsRef } from '@dataconnect/generated';


// Call the `listApplicationsRef()` function to get a reference to the query.
const ref = listApplicationsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listApplicationsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.applications);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.applications);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUser(): MutationPromise<CreateUserData, undefined>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface CreateUserRef {
  ...
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation has no variables.
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser } from '@dataconnect/generated';


// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser().then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef } from '@dataconnect/generated';


// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## UpdateUser
You can execute the `UpdateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateUser(vars: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;

interface UpdateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
}
export const updateUserRef: UpdateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUser(dc: DataConnect, vars: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;

interface UpdateUserRef {
  ...
  (dc: DataConnect, vars: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
}
export const updateUserRef: UpdateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserRef:
```typescript
const name = updateUserRef.operationName;
console.log(name);
```

### Variables
The `UpdateUser` mutation requires an argument of type `UpdateUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserVariables {
  id: UUIDString;
  fullName?: string | null;
}
```
### Return Type
Recall that executing the `UpdateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUser, UpdateUserVariables } from '@dataconnect/generated';

// The `UpdateUser` mutation requires an argument of type `UpdateUserVariables`:
const updateUserVars: UpdateUserVariables = {
  id: ..., 
  fullName: ..., // optional
};

// Call the `updateUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUser(updateUserVars);
// Variables can be defined inline as well.
const { data } = await updateUser({ id: ..., fullName: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUser(dataConnect, updateUserVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUser(updateUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserRef, UpdateUserVariables } from '@dataconnect/generated';

// The `UpdateUser` mutation requires an argument of type `UpdateUserVariables`:
const updateUserVars: UpdateUserVariables = {
  id: ..., 
  fullName: ..., // optional
};

// Call the `updateUserRef()` function to get a reference to the mutation.
const ref = updateUserRef(updateUserVars);
// Variables can be defined inline as well.
const ref = updateUserRef({ id: ..., fullName: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserRef(dataConnect, updateUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## DeleteUser
You can execute the `DeleteUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteUser(vars: DeleteUserVariables): MutationPromise<DeleteUserData, DeleteUserVariables>;

interface DeleteUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUserVariables): MutationRef<DeleteUserData, DeleteUserVariables>;
}
export const deleteUserRef: DeleteUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteUser(dc: DataConnect, vars: DeleteUserVariables): MutationPromise<DeleteUserData, DeleteUserVariables>;

interface DeleteUserRef {
  ...
  (dc: DataConnect, vars: DeleteUserVariables): MutationRef<DeleteUserData, DeleteUserVariables>;
}
export const deleteUserRef: DeleteUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteUserRef:
```typescript
const name = deleteUserRef.operationName;
console.log(name);
```

### Variables
The `DeleteUser` mutation requires an argument of type `DeleteUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteUserVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteUserData {
  user_delete?: User_Key | null;
}
```
### Using `DeleteUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteUser, DeleteUserVariables } from '@dataconnect/generated';

// The `DeleteUser` mutation requires an argument of type `DeleteUserVariables`:
const deleteUserVars: DeleteUserVariables = {
  id: ..., 
};

// Call the `deleteUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteUser(deleteUserVars);
// Variables can be defined inline as well.
const { data } = await deleteUser({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteUser(dataConnect, deleteUserVars);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
deleteUser(deleteUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

### Using `DeleteUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteUserRef, DeleteUserVariables } from '@dataconnect/generated';

// The `DeleteUser` mutation requires an argument of type `DeleteUserVariables`:
const deleteUserVars: DeleteUserVariables = {
  id: ..., 
};

// Call the `deleteUserRef()` function to get a reference to the mutation.
const ref = deleteUserRef(deleteUserVars);
// Variables can be defined inline as well.
const ref = deleteUserRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteUserRef(dataConnect, deleteUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

## CreateJob
You can execute the `CreateJob` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createJob(): MutationPromise<CreateJobData, undefined>;

interface CreateJobRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateJobData, undefined>;
}
export const createJobRef: CreateJobRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createJob(dc: DataConnect): MutationPromise<CreateJobData, undefined>;

interface CreateJobRef {
  ...
  (dc: DataConnect): MutationRef<CreateJobData, undefined>;
}
export const createJobRef: CreateJobRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createJobRef:
```typescript
const name = createJobRef.operationName;
console.log(name);
```

### Variables
The `CreateJob` mutation has no variables.
### Return Type
Recall that executing the `CreateJob` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateJobData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateJobData {
  job_insert: Job_Key;
}
```
### Using `CreateJob`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createJob } from '@dataconnect/generated';


// Call the `createJob()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createJob();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createJob(dataConnect);

console.log(data.job_insert);

// Or, you can use the `Promise` API.
createJob().then((response) => {
  const data = response.data;
  console.log(data.job_insert);
});
```

### Using `CreateJob`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createJobRef } from '@dataconnect/generated';


// Call the `createJobRef()` function to get a reference to the mutation.
const ref = createJobRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createJobRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.job_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.job_insert);
});
```

## UpdateJob
You can execute the `UpdateJob` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateJob(vars: UpdateJobVariables): MutationPromise<UpdateJobData, UpdateJobVariables>;

interface UpdateJobRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateJobVariables): MutationRef<UpdateJobData, UpdateJobVariables>;
}
export const updateJobRef: UpdateJobRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateJob(dc: DataConnect, vars: UpdateJobVariables): MutationPromise<UpdateJobData, UpdateJobVariables>;

interface UpdateJobRef {
  ...
  (dc: DataConnect, vars: UpdateJobVariables): MutationRef<UpdateJobData, UpdateJobVariables>;
}
export const updateJobRef: UpdateJobRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateJobRef:
```typescript
const name = updateJobRef.operationName;
console.log(name);
```

### Variables
The `UpdateJob` mutation requires an argument of type `UpdateJobVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateJobVariables {
  id: UUIDString;
  title?: string | null;
}
```
### Return Type
Recall that executing the `UpdateJob` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateJobData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateJobData {
  job_update?: Job_Key | null;
}
```
### Using `UpdateJob`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateJob, UpdateJobVariables } from '@dataconnect/generated';

// The `UpdateJob` mutation requires an argument of type `UpdateJobVariables`:
const updateJobVars: UpdateJobVariables = {
  id: ..., 
  title: ..., // optional
};

// Call the `updateJob()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateJob(updateJobVars);
// Variables can be defined inline as well.
const { data } = await updateJob({ id: ..., title: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateJob(dataConnect, updateJobVars);

console.log(data.job_update);

// Or, you can use the `Promise` API.
updateJob(updateJobVars).then((response) => {
  const data = response.data;
  console.log(data.job_update);
});
```

### Using `UpdateJob`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateJobRef, UpdateJobVariables } from '@dataconnect/generated';

// The `UpdateJob` mutation requires an argument of type `UpdateJobVariables`:
const updateJobVars: UpdateJobVariables = {
  id: ..., 
  title: ..., // optional
};

// Call the `updateJobRef()` function to get a reference to the mutation.
const ref = updateJobRef(updateJobVars);
// Variables can be defined inline as well.
const ref = updateJobRef({ id: ..., title: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateJobRef(dataConnect, updateJobVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.job_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.job_update);
});
```

## DeleteJob
You can execute the `DeleteJob` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteJob(vars: DeleteJobVariables): MutationPromise<DeleteJobData, DeleteJobVariables>;

interface DeleteJobRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteJobVariables): MutationRef<DeleteJobData, DeleteJobVariables>;
}
export const deleteJobRef: DeleteJobRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteJob(dc: DataConnect, vars: DeleteJobVariables): MutationPromise<DeleteJobData, DeleteJobVariables>;

interface DeleteJobRef {
  ...
  (dc: DataConnect, vars: DeleteJobVariables): MutationRef<DeleteJobData, DeleteJobVariables>;
}
export const deleteJobRef: DeleteJobRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteJobRef:
```typescript
const name = deleteJobRef.operationName;
console.log(name);
```

### Variables
The `DeleteJob` mutation requires an argument of type `DeleteJobVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteJobVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteJob` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteJobData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteJobData {
  job_delete?: Job_Key | null;
}
```
### Using `DeleteJob`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteJob, DeleteJobVariables } from '@dataconnect/generated';

// The `DeleteJob` mutation requires an argument of type `DeleteJobVariables`:
const deleteJobVars: DeleteJobVariables = {
  id: ..., 
};

// Call the `deleteJob()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteJob(deleteJobVars);
// Variables can be defined inline as well.
const { data } = await deleteJob({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteJob(dataConnect, deleteJobVars);

console.log(data.job_delete);

// Or, you can use the `Promise` API.
deleteJob(deleteJobVars).then((response) => {
  const data = response.data;
  console.log(data.job_delete);
});
```

### Using `DeleteJob`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteJobRef, DeleteJobVariables } from '@dataconnect/generated';

// The `DeleteJob` mutation requires an argument of type `DeleteJobVariables`:
const deleteJobVars: DeleteJobVariables = {
  id: ..., 
};

// Call the `deleteJobRef()` function to get a reference to the mutation.
const ref = deleteJobRef(deleteJobVars);
// Variables can be defined inline as well.
const ref = deleteJobRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteJobRef(dataConnect, deleteJobVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.job_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.job_delete);
});
```

## CreateCategory
You can execute the `CreateCategory` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createCategory(): MutationPromise<CreateCategoryData, undefined>;

interface CreateCategoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateCategoryData, undefined>;
}
export const createCategoryRef: CreateCategoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createCategory(dc: DataConnect): MutationPromise<CreateCategoryData, undefined>;

interface CreateCategoryRef {
  ...
  (dc: DataConnect): MutationRef<CreateCategoryData, undefined>;
}
export const createCategoryRef: CreateCategoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createCategoryRef:
```typescript
const name = createCategoryRef.operationName;
console.log(name);
```

### Variables
The `CreateCategory` mutation has no variables.
### Return Type
Recall that executing the `CreateCategory` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateCategoryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateCategoryData {
  category_insert: Category_Key;
}
```
### Using `CreateCategory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createCategory } from '@dataconnect/generated';


// Call the `createCategory()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createCategory();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createCategory(dataConnect);

console.log(data.category_insert);

// Or, you can use the `Promise` API.
createCategory().then((response) => {
  const data = response.data;
  console.log(data.category_insert);
});
```

### Using `CreateCategory`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createCategoryRef } from '@dataconnect/generated';


// Call the `createCategoryRef()` function to get a reference to the mutation.
const ref = createCategoryRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createCategoryRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.category_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.category_insert);
});
```

## UpdateCategory
You can execute the `UpdateCategory` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateCategory(vars: UpdateCategoryVariables): MutationPromise<UpdateCategoryData, UpdateCategoryVariables>;

interface UpdateCategoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCategoryVariables): MutationRef<UpdateCategoryData, UpdateCategoryVariables>;
}
export const updateCategoryRef: UpdateCategoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateCategory(dc: DataConnect, vars: UpdateCategoryVariables): MutationPromise<UpdateCategoryData, UpdateCategoryVariables>;

interface UpdateCategoryRef {
  ...
  (dc: DataConnect, vars: UpdateCategoryVariables): MutationRef<UpdateCategoryData, UpdateCategoryVariables>;
}
export const updateCategoryRef: UpdateCategoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateCategoryRef:
```typescript
const name = updateCategoryRef.operationName;
console.log(name);
```

### Variables
The `UpdateCategory` mutation requires an argument of type `UpdateCategoryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateCategoryVariables {
  id: UUIDString;
  name?: string | null;
}
```
### Return Type
Recall that executing the `UpdateCategory` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateCategoryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateCategoryData {
  category_update?: Category_Key | null;
}
```
### Using `UpdateCategory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateCategory, UpdateCategoryVariables } from '@dataconnect/generated';

// The `UpdateCategory` mutation requires an argument of type `UpdateCategoryVariables`:
const updateCategoryVars: UpdateCategoryVariables = {
  id: ..., 
  name: ..., // optional
};

// Call the `updateCategory()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateCategory(updateCategoryVars);
// Variables can be defined inline as well.
const { data } = await updateCategory({ id: ..., name: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateCategory(dataConnect, updateCategoryVars);

console.log(data.category_update);

// Or, you can use the `Promise` API.
updateCategory(updateCategoryVars).then((response) => {
  const data = response.data;
  console.log(data.category_update);
});
```

### Using `UpdateCategory`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateCategoryRef, UpdateCategoryVariables } from '@dataconnect/generated';

// The `UpdateCategory` mutation requires an argument of type `UpdateCategoryVariables`:
const updateCategoryVars: UpdateCategoryVariables = {
  id: ..., 
  name: ..., // optional
};

// Call the `updateCategoryRef()` function to get a reference to the mutation.
const ref = updateCategoryRef(updateCategoryVars);
// Variables can be defined inline as well.
const ref = updateCategoryRef({ id: ..., name: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateCategoryRef(dataConnect, updateCategoryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.category_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.category_update);
});
```

## DeleteCategory
You can execute the `DeleteCategory` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteCategory(vars: DeleteCategoryVariables): MutationPromise<DeleteCategoryData, DeleteCategoryVariables>;

interface DeleteCategoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCategoryVariables): MutationRef<DeleteCategoryData, DeleteCategoryVariables>;
}
export const deleteCategoryRef: DeleteCategoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteCategory(dc: DataConnect, vars: DeleteCategoryVariables): MutationPromise<DeleteCategoryData, DeleteCategoryVariables>;

interface DeleteCategoryRef {
  ...
  (dc: DataConnect, vars: DeleteCategoryVariables): MutationRef<DeleteCategoryData, DeleteCategoryVariables>;
}
export const deleteCategoryRef: DeleteCategoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteCategoryRef:
```typescript
const name = deleteCategoryRef.operationName;
console.log(name);
```

### Variables
The `DeleteCategory` mutation requires an argument of type `DeleteCategoryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteCategoryVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteCategory` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteCategoryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteCategoryData {
  category_delete?: Category_Key | null;
}
```
### Using `DeleteCategory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteCategory, DeleteCategoryVariables } from '@dataconnect/generated';

// The `DeleteCategory` mutation requires an argument of type `DeleteCategoryVariables`:
const deleteCategoryVars: DeleteCategoryVariables = {
  id: ..., 
};

// Call the `deleteCategory()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteCategory(deleteCategoryVars);
// Variables can be defined inline as well.
const { data } = await deleteCategory({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteCategory(dataConnect, deleteCategoryVars);

console.log(data.category_delete);

// Or, you can use the `Promise` API.
deleteCategory(deleteCategoryVars).then((response) => {
  const data = response.data;
  console.log(data.category_delete);
});
```

### Using `DeleteCategory`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteCategoryRef, DeleteCategoryVariables } from '@dataconnect/generated';

// The `DeleteCategory` mutation requires an argument of type `DeleteCategoryVariables`:
const deleteCategoryVars: DeleteCategoryVariables = {
  id: ..., 
};

// Call the `deleteCategoryRef()` function to get a reference to the mutation.
const ref = deleteCategoryRef(deleteCategoryVars);
// Variables can be defined inline as well.
const ref = deleteCategoryRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteCategoryRef(dataConnect, deleteCategoryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.category_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.category_delete);
});
```

## CreateStudyMaterial
You can execute the `CreateStudyMaterial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createStudyMaterial(vars: CreateStudyMaterialVariables): MutationPromise<CreateStudyMaterialData, CreateStudyMaterialVariables>;

interface CreateStudyMaterialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateStudyMaterialVariables): MutationRef<CreateStudyMaterialData, CreateStudyMaterialVariables>;
}
export const createStudyMaterialRef: CreateStudyMaterialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createStudyMaterial(dc: DataConnect, vars: CreateStudyMaterialVariables): MutationPromise<CreateStudyMaterialData, CreateStudyMaterialVariables>;

interface CreateStudyMaterialRef {
  ...
  (dc: DataConnect, vars: CreateStudyMaterialVariables): MutationRef<CreateStudyMaterialData, CreateStudyMaterialVariables>;
}
export const createStudyMaterialRef: CreateStudyMaterialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createStudyMaterialRef:
```typescript
const name = createStudyMaterialRef.operationName;
console.log(name);
```

### Variables
The `CreateStudyMaterial` mutation requires an argument of type `CreateStudyMaterialVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateStudyMaterialVariables {
  catId: UUIDString;
}
```
### Return Type
Recall that executing the `CreateStudyMaterial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateStudyMaterialData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateStudyMaterialData {
  studyMaterial_insert: StudyMaterial_Key;
}
```
### Using `CreateStudyMaterial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createStudyMaterial, CreateStudyMaterialVariables } from '@dataconnect/generated';

// The `CreateStudyMaterial` mutation requires an argument of type `CreateStudyMaterialVariables`:
const createStudyMaterialVars: CreateStudyMaterialVariables = {
  catId: ..., 
};

// Call the `createStudyMaterial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createStudyMaterial(createStudyMaterialVars);
// Variables can be defined inline as well.
const { data } = await createStudyMaterial({ catId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createStudyMaterial(dataConnect, createStudyMaterialVars);

console.log(data.studyMaterial_insert);

// Or, you can use the `Promise` API.
createStudyMaterial(createStudyMaterialVars).then((response) => {
  const data = response.data;
  console.log(data.studyMaterial_insert);
});
```

### Using `CreateStudyMaterial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createStudyMaterialRef, CreateStudyMaterialVariables } from '@dataconnect/generated';

// The `CreateStudyMaterial` mutation requires an argument of type `CreateStudyMaterialVariables`:
const createStudyMaterialVars: CreateStudyMaterialVariables = {
  catId: ..., 
};

// Call the `createStudyMaterialRef()` function to get a reference to the mutation.
const ref = createStudyMaterialRef(createStudyMaterialVars);
// Variables can be defined inline as well.
const ref = createStudyMaterialRef({ catId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createStudyMaterialRef(dataConnect, createStudyMaterialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.studyMaterial_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.studyMaterial_insert);
});
```

## UpdateStudyMaterial
You can execute the `UpdateStudyMaterial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateStudyMaterial(vars: UpdateStudyMaterialVariables): MutationPromise<UpdateStudyMaterialData, UpdateStudyMaterialVariables>;

interface UpdateStudyMaterialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateStudyMaterialVariables): MutationRef<UpdateStudyMaterialData, UpdateStudyMaterialVariables>;
}
export const updateStudyMaterialRef: UpdateStudyMaterialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateStudyMaterial(dc: DataConnect, vars: UpdateStudyMaterialVariables): MutationPromise<UpdateStudyMaterialData, UpdateStudyMaterialVariables>;

interface UpdateStudyMaterialRef {
  ...
  (dc: DataConnect, vars: UpdateStudyMaterialVariables): MutationRef<UpdateStudyMaterialData, UpdateStudyMaterialVariables>;
}
export const updateStudyMaterialRef: UpdateStudyMaterialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateStudyMaterialRef:
```typescript
const name = updateStudyMaterialRef.operationName;
console.log(name);
```

### Variables
The `UpdateStudyMaterial` mutation requires an argument of type `UpdateStudyMaterialVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateStudyMaterialVariables {
  id: UUIDString;
  title?: string | null;
}
```
### Return Type
Recall that executing the `UpdateStudyMaterial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateStudyMaterialData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateStudyMaterialData {
  studyMaterial_update?: StudyMaterial_Key | null;
}
```
### Using `UpdateStudyMaterial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateStudyMaterial, UpdateStudyMaterialVariables } from '@dataconnect/generated';

// The `UpdateStudyMaterial` mutation requires an argument of type `UpdateStudyMaterialVariables`:
const updateStudyMaterialVars: UpdateStudyMaterialVariables = {
  id: ..., 
  title: ..., // optional
};

// Call the `updateStudyMaterial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateStudyMaterial(updateStudyMaterialVars);
// Variables can be defined inline as well.
const { data } = await updateStudyMaterial({ id: ..., title: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateStudyMaterial(dataConnect, updateStudyMaterialVars);

console.log(data.studyMaterial_update);

// Or, you can use the `Promise` API.
updateStudyMaterial(updateStudyMaterialVars).then((response) => {
  const data = response.data;
  console.log(data.studyMaterial_update);
});
```

### Using `UpdateStudyMaterial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateStudyMaterialRef, UpdateStudyMaterialVariables } from '@dataconnect/generated';

// The `UpdateStudyMaterial` mutation requires an argument of type `UpdateStudyMaterialVariables`:
const updateStudyMaterialVars: UpdateStudyMaterialVariables = {
  id: ..., 
  title: ..., // optional
};

// Call the `updateStudyMaterialRef()` function to get a reference to the mutation.
const ref = updateStudyMaterialRef(updateStudyMaterialVars);
// Variables can be defined inline as well.
const ref = updateStudyMaterialRef({ id: ..., title: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateStudyMaterialRef(dataConnect, updateStudyMaterialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.studyMaterial_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.studyMaterial_update);
});
```

## DeleteStudyMaterial
You can execute the `DeleteStudyMaterial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteStudyMaterial(vars: DeleteStudyMaterialVariables): MutationPromise<DeleteStudyMaterialData, DeleteStudyMaterialVariables>;

interface DeleteStudyMaterialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteStudyMaterialVariables): MutationRef<DeleteStudyMaterialData, DeleteStudyMaterialVariables>;
}
export const deleteStudyMaterialRef: DeleteStudyMaterialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteStudyMaterial(dc: DataConnect, vars: DeleteStudyMaterialVariables): MutationPromise<DeleteStudyMaterialData, DeleteStudyMaterialVariables>;

interface DeleteStudyMaterialRef {
  ...
  (dc: DataConnect, vars: DeleteStudyMaterialVariables): MutationRef<DeleteStudyMaterialData, DeleteStudyMaterialVariables>;
}
export const deleteStudyMaterialRef: DeleteStudyMaterialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteStudyMaterialRef:
```typescript
const name = deleteStudyMaterialRef.operationName;
console.log(name);
```

### Variables
The `DeleteStudyMaterial` mutation requires an argument of type `DeleteStudyMaterialVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteStudyMaterialVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteStudyMaterial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteStudyMaterialData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteStudyMaterialData {
  studyMaterial_delete?: StudyMaterial_Key | null;
}
```
### Using `DeleteStudyMaterial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteStudyMaterial, DeleteStudyMaterialVariables } from '@dataconnect/generated';

// The `DeleteStudyMaterial` mutation requires an argument of type `DeleteStudyMaterialVariables`:
const deleteStudyMaterialVars: DeleteStudyMaterialVariables = {
  id: ..., 
};

// Call the `deleteStudyMaterial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteStudyMaterial(deleteStudyMaterialVars);
// Variables can be defined inline as well.
const { data } = await deleteStudyMaterial({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteStudyMaterial(dataConnect, deleteStudyMaterialVars);

console.log(data.studyMaterial_delete);

// Or, you can use the `Promise` API.
deleteStudyMaterial(deleteStudyMaterialVars).then((response) => {
  const data = response.data;
  console.log(data.studyMaterial_delete);
});
```

### Using `DeleteStudyMaterial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteStudyMaterialRef, DeleteStudyMaterialVariables } from '@dataconnect/generated';

// The `DeleteStudyMaterial` mutation requires an argument of type `DeleteStudyMaterialVariables`:
const deleteStudyMaterialVars: DeleteStudyMaterialVariables = {
  id: ..., 
};

// Call the `deleteStudyMaterialRef()` function to get a reference to the mutation.
const ref = deleteStudyMaterialRef(deleteStudyMaterialVars);
// Variables can be defined inline as well.
const ref = deleteStudyMaterialRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteStudyMaterialRef(dataConnect, deleteStudyMaterialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.studyMaterial_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.studyMaterial_delete);
});
```

## CreateProgress
You can execute the `CreateProgress` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createProgress(vars: CreateProgressVariables): MutationPromise<CreateProgressData, CreateProgressVariables>;

interface CreateProgressRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProgressVariables): MutationRef<CreateProgressData, CreateProgressVariables>;
}
export const createProgressRef: CreateProgressRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createProgress(dc: DataConnect, vars: CreateProgressVariables): MutationPromise<CreateProgressData, CreateProgressVariables>;

interface CreateProgressRef {
  ...
  (dc: DataConnect, vars: CreateProgressVariables): MutationRef<CreateProgressData, CreateProgressVariables>;
}
export const createProgressRef: CreateProgressRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createProgressRef:
```typescript
const name = createProgressRef.operationName;
console.log(name);
```

### Variables
The `CreateProgress` mutation requires an argument of type `CreateProgressVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateProgressVariables {
  userId: UUIDString;
  materialId: UUIDString;
}
```
### Return Type
Recall that executing the `CreateProgress` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateProgressData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateProgressData {
  progress_insert: Progress_Key;
}
```
### Using `CreateProgress`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createProgress, CreateProgressVariables } from '@dataconnect/generated';

// The `CreateProgress` mutation requires an argument of type `CreateProgressVariables`:
const createProgressVars: CreateProgressVariables = {
  userId: ..., 
  materialId: ..., 
};

// Call the `createProgress()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createProgress(createProgressVars);
// Variables can be defined inline as well.
const { data } = await createProgress({ userId: ..., materialId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createProgress(dataConnect, createProgressVars);

console.log(data.progress_insert);

// Or, you can use the `Promise` API.
createProgress(createProgressVars).then((response) => {
  const data = response.data;
  console.log(data.progress_insert);
});
```

### Using `CreateProgress`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createProgressRef, CreateProgressVariables } from '@dataconnect/generated';

// The `CreateProgress` mutation requires an argument of type `CreateProgressVariables`:
const createProgressVars: CreateProgressVariables = {
  userId: ..., 
  materialId: ..., 
};

// Call the `createProgressRef()` function to get a reference to the mutation.
const ref = createProgressRef(createProgressVars);
// Variables can be defined inline as well.
const ref = createProgressRef({ userId: ..., materialId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createProgressRef(dataConnect, createProgressVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.progress_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.progress_insert);
});
```

## UpdateProgress
You can execute the `UpdateProgress` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateProgress(vars: UpdateProgressVariables): MutationPromise<UpdateProgressData, UpdateProgressVariables>;

interface UpdateProgressRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProgressVariables): MutationRef<UpdateProgressData, UpdateProgressVariables>;
}
export const updateProgressRef: UpdateProgressRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateProgress(dc: DataConnect, vars: UpdateProgressVariables): MutationPromise<UpdateProgressData, UpdateProgressVariables>;

interface UpdateProgressRef {
  ...
  (dc: DataConnect, vars: UpdateProgressVariables): MutationRef<UpdateProgressData, UpdateProgressVariables>;
}
export const updateProgressRef: UpdateProgressRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateProgressRef:
```typescript
const name = updateProgressRef.operationName;
console.log(name);
```

### Variables
The `UpdateProgress` mutation requires an argument of type `UpdateProgressVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateProgressVariables {
  id: UUIDString;
  status?: string | null;
}
```
### Return Type
Recall that executing the `UpdateProgress` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateProgressData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateProgressData {
  progress_update?: Progress_Key | null;
}
```
### Using `UpdateProgress`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateProgress, UpdateProgressVariables } from '@dataconnect/generated';

// The `UpdateProgress` mutation requires an argument of type `UpdateProgressVariables`:
const updateProgressVars: UpdateProgressVariables = {
  id: ..., 
  status: ..., // optional
};

// Call the `updateProgress()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateProgress(updateProgressVars);
// Variables can be defined inline as well.
const { data } = await updateProgress({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateProgress(dataConnect, updateProgressVars);

console.log(data.progress_update);

// Or, you can use the `Promise` API.
updateProgress(updateProgressVars).then((response) => {
  const data = response.data;
  console.log(data.progress_update);
});
```

### Using `UpdateProgress`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateProgressRef, UpdateProgressVariables } from '@dataconnect/generated';

// The `UpdateProgress` mutation requires an argument of type `UpdateProgressVariables`:
const updateProgressVars: UpdateProgressVariables = {
  id: ..., 
  status: ..., // optional
};

// Call the `updateProgressRef()` function to get a reference to the mutation.
const ref = updateProgressRef(updateProgressVars);
// Variables can be defined inline as well.
const ref = updateProgressRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateProgressRef(dataConnect, updateProgressVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.progress_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.progress_update);
});
```

## DeleteProgress
You can execute the `DeleteProgress` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteProgress(vars: DeleteProgressVariables): MutationPromise<DeleteProgressData, DeleteProgressVariables>;

interface DeleteProgressRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteProgressVariables): MutationRef<DeleteProgressData, DeleteProgressVariables>;
}
export const deleteProgressRef: DeleteProgressRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteProgress(dc: DataConnect, vars: DeleteProgressVariables): MutationPromise<DeleteProgressData, DeleteProgressVariables>;

interface DeleteProgressRef {
  ...
  (dc: DataConnect, vars: DeleteProgressVariables): MutationRef<DeleteProgressData, DeleteProgressVariables>;
}
export const deleteProgressRef: DeleteProgressRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteProgressRef:
```typescript
const name = deleteProgressRef.operationName;
console.log(name);
```

### Variables
The `DeleteProgress` mutation requires an argument of type `DeleteProgressVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteProgressVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteProgress` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteProgressData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteProgressData {
  progress_delete?: Progress_Key | null;
}
```
### Using `DeleteProgress`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteProgress, DeleteProgressVariables } from '@dataconnect/generated';

// The `DeleteProgress` mutation requires an argument of type `DeleteProgressVariables`:
const deleteProgressVars: DeleteProgressVariables = {
  id: ..., 
};

// Call the `deleteProgress()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteProgress(deleteProgressVars);
// Variables can be defined inline as well.
const { data } = await deleteProgress({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteProgress(dataConnect, deleteProgressVars);

console.log(data.progress_delete);

// Or, you can use the `Promise` API.
deleteProgress(deleteProgressVars).then((response) => {
  const data = response.data;
  console.log(data.progress_delete);
});
```

### Using `DeleteProgress`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteProgressRef, DeleteProgressVariables } from '@dataconnect/generated';

// The `DeleteProgress` mutation requires an argument of type `DeleteProgressVariables`:
const deleteProgressVars: DeleteProgressVariables = {
  id: ..., 
};

// Call the `deleteProgressRef()` function to get a reference to the mutation.
const ref = deleteProgressRef(deleteProgressVars);
// Variables can be defined inline as well.
const ref = deleteProgressRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteProgressRef(dataConnect, deleteProgressVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.progress_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.progress_delete);
});
```

## SaveJob
You can execute the `SaveJob` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
saveJob(vars: SaveJobVariables): MutationPromise<SaveJobData, SaveJobVariables>;

interface SaveJobRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SaveJobVariables): MutationRef<SaveJobData, SaveJobVariables>;
}
export const saveJobRef: SaveJobRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
saveJob(dc: DataConnect, vars: SaveJobVariables): MutationPromise<SaveJobData, SaveJobVariables>;

interface SaveJobRef {
  ...
  (dc: DataConnect, vars: SaveJobVariables): MutationRef<SaveJobData, SaveJobVariables>;
}
export const saveJobRef: SaveJobRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the saveJobRef:
```typescript
const name = saveJobRef.operationName;
console.log(name);
```

### Variables
The `SaveJob` mutation requires an argument of type `SaveJobVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SaveJobVariables {
  jobId: UUIDString;
}
```
### Return Type
Recall that executing the `SaveJob` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SaveJobData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SaveJobData {
  savedJob_insert: SavedJob_Key;
}
```
### Using `SaveJob`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, saveJob, SaveJobVariables } from '@dataconnect/generated';

// The `SaveJob` mutation requires an argument of type `SaveJobVariables`:
const saveJobVars: SaveJobVariables = {
  jobId: ..., 
};

// Call the `saveJob()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await saveJob(saveJobVars);
// Variables can be defined inline as well.
const { data } = await saveJob({ jobId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await saveJob(dataConnect, saveJobVars);

console.log(data.savedJob_insert);

// Or, you can use the `Promise` API.
saveJob(saveJobVars).then((response) => {
  const data = response.data;
  console.log(data.savedJob_insert);
});
```

### Using `SaveJob`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, saveJobRef, SaveJobVariables } from '@dataconnect/generated';

// The `SaveJob` mutation requires an argument of type `SaveJobVariables`:
const saveJobVars: SaveJobVariables = {
  jobId: ..., 
};

// Call the `saveJobRef()` function to get a reference to the mutation.
const ref = saveJobRef(saveJobVars);
// Variables can be defined inline as well.
const ref = saveJobRef({ jobId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = saveJobRef(dataConnect, saveJobVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.savedJob_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.savedJob_insert);
});
```

## DeleteSavedJob
You can execute the `DeleteSavedJob` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteSavedJob(vars: DeleteSavedJobVariables): MutationPromise<DeleteSavedJobData, DeleteSavedJobVariables>;

interface DeleteSavedJobRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSavedJobVariables): MutationRef<DeleteSavedJobData, DeleteSavedJobVariables>;
}
export const deleteSavedJobRef: DeleteSavedJobRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteSavedJob(dc: DataConnect, vars: DeleteSavedJobVariables): MutationPromise<DeleteSavedJobData, DeleteSavedJobVariables>;

interface DeleteSavedJobRef {
  ...
  (dc: DataConnect, vars: DeleteSavedJobVariables): MutationRef<DeleteSavedJobData, DeleteSavedJobVariables>;
}
export const deleteSavedJobRef: DeleteSavedJobRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteSavedJobRef:
```typescript
const name = deleteSavedJobRef.operationName;
console.log(name);
```

### Variables
The `DeleteSavedJob` mutation requires an argument of type `DeleteSavedJobVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteSavedJobVariables {
  jobId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteSavedJob` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteSavedJobData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteSavedJobData {
  savedJob_delete?: SavedJob_Key | null;
}
```
### Using `DeleteSavedJob`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteSavedJob, DeleteSavedJobVariables } from '@dataconnect/generated';

// The `DeleteSavedJob` mutation requires an argument of type `DeleteSavedJobVariables`:
const deleteSavedJobVars: DeleteSavedJobVariables = {
  jobId: ..., 
};

// Call the `deleteSavedJob()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteSavedJob(deleteSavedJobVars);
// Variables can be defined inline as well.
const { data } = await deleteSavedJob({ jobId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteSavedJob(dataConnect, deleteSavedJobVars);

console.log(data.savedJob_delete);

// Or, you can use the `Promise` API.
deleteSavedJob(deleteSavedJobVars).then((response) => {
  const data = response.data;
  console.log(data.savedJob_delete);
});
```

### Using `DeleteSavedJob`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteSavedJobRef, DeleteSavedJobVariables } from '@dataconnect/generated';

// The `DeleteSavedJob` mutation requires an argument of type `DeleteSavedJobVariables`:
const deleteSavedJobVars: DeleteSavedJobVariables = {
  jobId: ..., 
};

// Call the `deleteSavedJobRef()` function to get a reference to the mutation.
const ref = deleteSavedJobRef(deleteSavedJobVars);
// Variables can be defined inline as well.
const ref = deleteSavedJobRef({ jobId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteSavedJobRef(dataConnect, deleteSavedJobVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.savedJob_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.savedJob_delete);
});
```

## SaveMaterial
You can execute the `SaveMaterial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
saveMaterial(vars: SaveMaterialVariables): MutationPromise<SaveMaterialData, SaveMaterialVariables>;

interface SaveMaterialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SaveMaterialVariables): MutationRef<SaveMaterialData, SaveMaterialVariables>;
}
export const saveMaterialRef: SaveMaterialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
saveMaterial(dc: DataConnect, vars: SaveMaterialVariables): MutationPromise<SaveMaterialData, SaveMaterialVariables>;

interface SaveMaterialRef {
  ...
  (dc: DataConnect, vars: SaveMaterialVariables): MutationRef<SaveMaterialData, SaveMaterialVariables>;
}
export const saveMaterialRef: SaveMaterialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the saveMaterialRef:
```typescript
const name = saveMaterialRef.operationName;
console.log(name);
```

### Variables
The `SaveMaterial` mutation requires an argument of type `SaveMaterialVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SaveMaterialVariables {
  materialId: UUIDString;
}
```
### Return Type
Recall that executing the `SaveMaterial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SaveMaterialData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SaveMaterialData {
  savedMaterial_insert: SavedMaterial_Key;
}
```
### Using `SaveMaterial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, saveMaterial, SaveMaterialVariables } from '@dataconnect/generated';

// The `SaveMaterial` mutation requires an argument of type `SaveMaterialVariables`:
const saveMaterialVars: SaveMaterialVariables = {
  materialId: ..., 
};

// Call the `saveMaterial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await saveMaterial(saveMaterialVars);
// Variables can be defined inline as well.
const { data } = await saveMaterial({ materialId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await saveMaterial(dataConnect, saveMaterialVars);

console.log(data.savedMaterial_insert);

// Or, you can use the `Promise` API.
saveMaterial(saveMaterialVars).then((response) => {
  const data = response.data;
  console.log(data.savedMaterial_insert);
});
```

### Using `SaveMaterial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, saveMaterialRef, SaveMaterialVariables } from '@dataconnect/generated';

// The `SaveMaterial` mutation requires an argument of type `SaveMaterialVariables`:
const saveMaterialVars: SaveMaterialVariables = {
  materialId: ..., 
};

// Call the `saveMaterialRef()` function to get a reference to the mutation.
const ref = saveMaterialRef(saveMaterialVars);
// Variables can be defined inline as well.
const ref = saveMaterialRef({ materialId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = saveMaterialRef(dataConnect, saveMaterialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.savedMaterial_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.savedMaterial_insert);
});
```

## DeleteSavedMaterial
You can execute the `DeleteSavedMaterial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteSavedMaterial(vars: DeleteSavedMaterialVariables): MutationPromise<DeleteSavedMaterialData, DeleteSavedMaterialVariables>;

interface DeleteSavedMaterialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSavedMaterialVariables): MutationRef<DeleteSavedMaterialData, DeleteSavedMaterialVariables>;
}
export const deleteSavedMaterialRef: DeleteSavedMaterialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteSavedMaterial(dc: DataConnect, vars: DeleteSavedMaterialVariables): MutationPromise<DeleteSavedMaterialData, DeleteSavedMaterialVariables>;

interface DeleteSavedMaterialRef {
  ...
  (dc: DataConnect, vars: DeleteSavedMaterialVariables): MutationRef<DeleteSavedMaterialData, DeleteSavedMaterialVariables>;
}
export const deleteSavedMaterialRef: DeleteSavedMaterialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteSavedMaterialRef:
```typescript
const name = deleteSavedMaterialRef.operationName;
console.log(name);
```

### Variables
The `DeleteSavedMaterial` mutation requires an argument of type `DeleteSavedMaterialVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteSavedMaterialVariables {
  materialId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteSavedMaterial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteSavedMaterialData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteSavedMaterialData {
  savedMaterial_delete?: SavedMaterial_Key | null;
}
```
### Using `DeleteSavedMaterial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteSavedMaterial, DeleteSavedMaterialVariables } from '@dataconnect/generated';

// The `DeleteSavedMaterial` mutation requires an argument of type `DeleteSavedMaterialVariables`:
const deleteSavedMaterialVars: DeleteSavedMaterialVariables = {
  materialId: ..., 
};

// Call the `deleteSavedMaterial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteSavedMaterial(deleteSavedMaterialVars);
// Variables can be defined inline as well.
const { data } = await deleteSavedMaterial({ materialId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteSavedMaterial(dataConnect, deleteSavedMaterialVars);

console.log(data.savedMaterial_delete);

// Or, you can use the `Promise` API.
deleteSavedMaterial(deleteSavedMaterialVars).then((response) => {
  const data = response.data;
  console.log(data.savedMaterial_delete);
});
```

### Using `DeleteSavedMaterial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteSavedMaterialRef, DeleteSavedMaterialVariables } from '@dataconnect/generated';

// The `DeleteSavedMaterial` mutation requires an argument of type `DeleteSavedMaterialVariables`:
const deleteSavedMaterialVars: DeleteSavedMaterialVariables = {
  materialId: ..., 
};

// Call the `deleteSavedMaterialRef()` function to get a reference to the mutation.
const ref = deleteSavedMaterialRef(deleteSavedMaterialVars);
// Variables can be defined inline as well.
const ref = deleteSavedMaterialRef({ materialId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteSavedMaterialRef(dataConnect, deleteSavedMaterialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.savedMaterial_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.savedMaterial_delete);
});
```

## ApplyForJob
You can execute the `ApplyForJob` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
applyForJob(vars: ApplyForJobVariables): MutationPromise<ApplyForJobData, ApplyForJobVariables>;

interface ApplyForJobRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ApplyForJobVariables): MutationRef<ApplyForJobData, ApplyForJobVariables>;
}
export const applyForJobRef: ApplyForJobRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
applyForJob(dc: DataConnect, vars: ApplyForJobVariables): MutationPromise<ApplyForJobData, ApplyForJobVariables>;

interface ApplyForJobRef {
  ...
  (dc: DataConnect, vars: ApplyForJobVariables): MutationRef<ApplyForJobData, ApplyForJobVariables>;
}
export const applyForJobRef: ApplyForJobRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the applyForJobRef:
```typescript
const name = applyForJobRef.operationName;
console.log(name);
```

### Variables
The `ApplyForJob` mutation requires an argument of type `ApplyForJobVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ApplyForJobVariables {
  jobId: UUIDString;
}
```
### Return Type
Recall that executing the `ApplyForJob` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ApplyForJobData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ApplyForJobData {
  application_insert: Application_Key;
}
```
### Using `ApplyForJob`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, applyForJob, ApplyForJobVariables } from '@dataconnect/generated';

// The `ApplyForJob` mutation requires an argument of type `ApplyForJobVariables`:
const applyForJobVars: ApplyForJobVariables = {
  jobId: ..., 
};

// Call the `applyForJob()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await applyForJob(applyForJobVars);
// Variables can be defined inline as well.
const { data } = await applyForJob({ jobId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await applyForJob(dataConnect, applyForJobVars);

console.log(data.application_insert);

// Or, you can use the `Promise` API.
applyForJob(applyForJobVars).then((response) => {
  const data = response.data;
  console.log(data.application_insert);
});
```

### Using `ApplyForJob`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, applyForJobRef, ApplyForJobVariables } from '@dataconnect/generated';

// The `ApplyForJob` mutation requires an argument of type `ApplyForJobVariables`:
const applyForJobVars: ApplyForJobVariables = {
  jobId: ..., 
};

// Call the `applyForJobRef()` function to get a reference to the mutation.
const ref = applyForJobRef(applyForJobVars);
// Variables can be defined inline as well.
const ref = applyForJobRef({ jobId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = applyForJobRef(dataConnect, applyForJobVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.application_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.application_insert);
});
```

## DeleteApplication
You can execute the `DeleteApplication` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteApplication(vars: DeleteApplicationVariables): MutationPromise<DeleteApplicationData, DeleteApplicationVariables>;

interface DeleteApplicationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteApplicationVariables): MutationRef<DeleteApplicationData, DeleteApplicationVariables>;
}
export const deleteApplicationRef: DeleteApplicationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteApplication(dc: DataConnect, vars: DeleteApplicationVariables): MutationPromise<DeleteApplicationData, DeleteApplicationVariables>;

interface DeleteApplicationRef {
  ...
  (dc: DataConnect, vars: DeleteApplicationVariables): MutationRef<DeleteApplicationData, DeleteApplicationVariables>;
}
export const deleteApplicationRef: DeleteApplicationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteApplicationRef:
```typescript
const name = deleteApplicationRef.operationName;
console.log(name);
```

### Variables
The `DeleteApplication` mutation requires an argument of type `DeleteApplicationVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteApplicationVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteApplication` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteApplicationData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteApplicationData {
  application_delete?: Application_Key | null;
}
```
### Using `DeleteApplication`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteApplication, DeleteApplicationVariables } from '@dataconnect/generated';

// The `DeleteApplication` mutation requires an argument of type `DeleteApplicationVariables`:
const deleteApplicationVars: DeleteApplicationVariables = {
  id: ..., 
};

// Call the `deleteApplication()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteApplication(deleteApplicationVars);
// Variables can be defined inline as well.
const { data } = await deleteApplication({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteApplication(dataConnect, deleteApplicationVars);

console.log(data.application_delete);

// Or, you can use the `Promise` API.
deleteApplication(deleteApplicationVars).then((response) => {
  const data = response.data;
  console.log(data.application_delete);
});
```

### Using `DeleteApplication`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteApplicationRef, DeleteApplicationVariables } from '@dataconnect/generated';

// The `DeleteApplication` mutation requires an argument of type `DeleteApplicationVariables`:
const deleteApplicationVars: DeleteApplicationVariables = {
  id: ..., 
};

// Call the `deleteApplicationRef()` function to get a reference to the mutation.
const ref = deleteApplicationRef(deleteApplicationVars);
// Variables can be defined inline as well.
const ref = deleteApplicationRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteApplicationRef(dataConnect, deleteApplicationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.application_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.application_delete);
});
```

