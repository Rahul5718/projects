# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateUser, useUpdateUser, useDeleteUser, useGetUser, useListUsers, useCreateJob, useUpdateJob, useDeleteJob, useGetJob, useListJobs } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateUser();

const { data, isPending, isSuccess, isError, error } = useUpdateUser(updateUserVars);

const { data, isPending, isSuccess, isError, error } = useDeleteUser(deleteUserVars);

const { data, isPending, isSuccess, isError, error } = useGetUser(getUserVars);

const { data, isPending, isSuccess, isError, error } = useListUsers();

const { data, isPending, isSuccess, isError, error } = useCreateJob();

const { data, isPending, isSuccess, isError, error } = useUpdateJob(updateJobVars);

const { data, isPending, isSuccess, isError, error } = useDeleteJob(deleteJobVars);

const { data, isPending, isSuccess, isError, error } = useGetJob(getJobVars);

const { data, isPending, isSuccess, isError, error } = useListJobs();

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createUser, updateUser, deleteUser, getUser, listUsers, createJob, updateJob, deleteJob, getJob, listJobs } from '@dataconnect/generated';


// Operation CreateUser: 
const { data } = await CreateUser(dataConnect);

// Operation UpdateUser:  For variables, look at type UpdateUserVars in ../index.d.ts
const { data } = await UpdateUser(dataConnect, updateUserVars);

// Operation DeleteUser:  For variables, look at type DeleteUserVars in ../index.d.ts
const { data } = await DeleteUser(dataConnect, deleteUserVars);

// Operation GetUser:  For variables, look at type GetUserVars in ../index.d.ts
const { data } = await GetUser(dataConnect, getUserVars);

// Operation ListUsers: 
const { data } = await ListUsers(dataConnect);

// Operation CreateJob: 
const { data } = await CreateJob(dataConnect);

// Operation UpdateJob:  For variables, look at type UpdateJobVars in ../index.d.ts
const { data } = await UpdateJob(dataConnect, updateJobVars);

// Operation DeleteJob:  For variables, look at type DeleteJobVars in ../index.d.ts
const { data } = await DeleteJob(dataConnect, deleteJobVars);

// Operation GetJob:  For variables, look at type GetJobVars in ../index.d.ts
const { data } = await GetJob(dataConnect, getJobVars);

// Operation ListJobs: 
const { data } = await ListJobs(dataConnect);


```