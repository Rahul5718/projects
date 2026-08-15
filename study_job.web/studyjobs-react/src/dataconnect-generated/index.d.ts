import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Application_Key {
  id: UUIDString;
  __typename?: 'Application_Key';
}

export interface ApplyForJobData {
  application_insert: Application_Key;
}

export interface ApplyForJobVariables {
  jobId: UUIDString;
}

export interface Category_Key {
  id: UUIDString;
  __typename?: 'Category_Key';
}

export interface CreateCategoryData {
  category_insert: Category_Key;
}

export interface CreateJobData {
  job_insert: Job_Key;
}

export interface CreateProgressData {
  progress_insert: Progress_Key;
}

export interface CreateProgressVariables {
  userId: UUIDString;
  materialId: UUIDString;
}

export interface CreateStudyMaterialData {
  studyMaterial_insert: StudyMaterial_Key;
}

export interface CreateStudyMaterialVariables {
  catId: UUIDString;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface DeleteApplicationData {
  application_delete?: Application_Key | null;
}

export interface DeleteApplicationVariables {
  id: UUIDString;
}

export interface DeleteCategoryData {
  category_delete?: Category_Key | null;
}

export interface DeleteCategoryVariables {
  id: UUIDString;
}

export interface DeleteJobData {
  job_delete?: Job_Key | null;
}

export interface DeleteJobVariables {
  id: UUIDString;
}

export interface DeleteProgressData {
  progress_delete?: Progress_Key | null;
}

export interface DeleteProgressVariables {
  id: UUIDString;
}

export interface DeleteSavedJobData {
  savedJob_delete?: SavedJob_Key | null;
}

export interface DeleteSavedJobVariables {
  jobId: UUIDString;
}

export interface DeleteSavedMaterialData {
  savedMaterial_delete?: SavedMaterial_Key | null;
}

export interface DeleteSavedMaterialVariables {
  materialId: UUIDString;
}

export interface DeleteStudyMaterialData {
  studyMaterial_delete?: StudyMaterial_Key | null;
}

export interface DeleteStudyMaterialVariables {
  id: UUIDString;
}

export interface DeleteUserData {
  user_delete?: User_Key | null;
}

export interface DeleteUserVariables {
  id: UUIDString;
}

export interface GetCategoryData {
  category?: {
    name: string;
  };
}

export interface GetCategoryVariables {
  id: UUIDString;
}

export interface GetJobData {
  job?: {
    title: string;
    company: string;
    description: string;
  };
}

export interface GetJobVariables {
  id: UUIDString;
}

export interface GetProgressData {
  progress?: {
    status: string;
    lastAccessedDate?: TimestampString | null;
  };
}

export interface GetProgressVariables {
  id: UUIDString;
}

export interface GetStudyMaterialData {
  studyMaterial?: {
    title: string;
    contentType: string;
  };
}

export interface GetStudyMaterialVariables {
  id: UUIDString;
}

export interface GetUserData {
  user?: {
    email: string;
    fullName: string;
    role: string;
    bio?: string | null;
  };
}

export interface GetUserVariables {
  id: UUIDString;
}

export interface Job_Key {
  id: UUIDString;
  __typename?: 'Job_Key';
}

export interface ListApplicationsData {
  applications: ({
    status: string;
    job: {
      title: string;
    };
  })[];
}

export interface ListCategoriesData {
  categories: ({
    name: string;
  })[];
}

export interface ListJobsData {
  jobs: ({
    title: string;
    company: string;
  })[];
}

export interface ListProgressesData {
  progresses: ({
    status: string;
  })[];
}

export interface ListSavedJobsData {
  savedJobs: ({
    job: {
      title: string;
    };
  })[];
}

export interface ListSavedMaterialsData {
  savedMaterials: ({
    studyMaterial: {
      title: string;
    };
  })[];
}

export interface ListStudyMaterialsData {
  studyMaterials: ({
    title: string;
    contentType: string;
  })[];
}

export interface ListUsersData {
  users: ({
    email: string;
    fullName: string;
  })[];
}

export interface Progress_Key {
  id: UUIDString;
  __typename?: 'Progress_Key';
}

export interface SaveJobData {
  savedJob_insert: SavedJob_Key;
}

export interface SaveJobVariables {
  jobId: UUIDString;
}

export interface SaveMaterialData {
  savedMaterial_insert: SavedMaterial_Key;
}

export interface SaveMaterialVariables {
  materialId: UUIDString;
}

export interface SavedJob_Key {
  userId: UUIDString;
  jobId: UUIDString;
  __typename?: 'SavedJob_Key';
}

export interface SavedMaterial_Key {
  userId: UUIDString;
  studyMaterialId: UUIDString;
  __typename?: 'SavedMaterial_Key';
}

export interface StudyMaterial_Key {
  id: UUIDString;
  __typename?: 'StudyMaterial_Key';
}

export interface UpdateCategoryData {
  category_update?: Category_Key | null;
}

export interface UpdateCategoryVariables {
  id: UUIDString;
  name?: string | null;
}

export interface UpdateJobData {
  job_update?: Job_Key | null;
}

export interface UpdateJobVariables {
  id: UUIDString;
  title?: string | null;
}

export interface UpdateProgressData {
  progress_update?: Progress_Key | null;
}

export interface UpdateProgressVariables {
  id: UUIDString;
  status?: string | null;
}

export interface UpdateStudyMaterialData {
  studyMaterial_update?: StudyMaterial_Key | null;
}

export interface UpdateStudyMaterialVariables {
  id: UUIDString;
  title?: string | null;
}

export interface UpdateUserData {
  user_update?: User_Key | null;
}

export interface UpdateUserVariables {
  id: UUIDString;
  fullName?: string | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(): MutationPromise<CreateUserData, undefined>;
export function createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface UpdateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
  operationName: string;
}
export const updateUserRef: UpdateUserRef;

export function updateUser(vars: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;
export function updateUser(dc: DataConnect, vars: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;

interface DeleteUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUserVariables): MutationRef<DeleteUserData, DeleteUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteUserVariables): MutationRef<DeleteUserData, DeleteUserVariables>;
  operationName: string;
}
export const deleteUserRef: DeleteUserRef;

export function deleteUser(vars: DeleteUserVariables): MutationPromise<DeleteUserData, DeleteUserVariables>;
export function deleteUser(dc: DataConnect, vars: DeleteUserVariables): MutationPromise<DeleteUserData, DeleteUserVariables>;

interface GetUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserVariables): QueryRef<GetUserData, GetUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserVariables): QueryRef<GetUserData, GetUserVariables>;
  operationName: string;
}
export const getUserRef: GetUserRef;

export function getUser(vars: GetUserVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserData, GetUserVariables>;
export function getUser(dc: DataConnect, vars: GetUserVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserData, GetUserVariables>;

interface ListUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUsersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListUsersData, undefined>;
  operationName: string;
}
export const listUsersRef: ListUsersRef;

export function listUsers(options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;
export function listUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface CreateJobRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateJobData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateJobData, undefined>;
  operationName: string;
}
export const createJobRef: CreateJobRef;

export function createJob(): MutationPromise<CreateJobData, undefined>;
export function createJob(dc: DataConnect): MutationPromise<CreateJobData, undefined>;

interface UpdateJobRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateJobVariables): MutationRef<UpdateJobData, UpdateJobVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateJobVariables): MutationRef<UpdateJobData, UpdateJobVariables>;
  operationName: string;
}
export const updateJobRef: UpdateJobRef;

export function updateJob(vars: UpdateJobVariables): MutationPromise<UpdateJobData, UpdateJobVariables>;
export function updateJob(dc: DataConnect, vars: UpdateJobVariables): MutationPromise<UpdateJobData, UpdateJobVariables>;

interface DeleteJobRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteJobVariables): MutationRef<DeleteJobData, DeleteJobVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteJobVariables): MutationRef<DeleteJobData, DeleteJobVariables>;
  operationName: string;
}
export const deleteJobRef: DeleteJobRef;

export function deleteJob(vars: DeleteJobVariables): MutationPromise<DeleteJobData, DeleteJobVariables>;
export function deleteJob(dc: DataConnect, vars: DeleteJobVariables): MutationPromise<DeleteJobData, DeleteJobVariables>;

interface GetJobRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetJobVariables): QueryRef<GetJobData, GetJobVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetJobVariables): QueryRef<GetJobData, GetJobVariables>;
  operationName: string;
}
export const getJobRef: GetJobRef;

export function getJob(vars: GetJobVariables, options?: ExecuteQueryOptions): QueryPromise<GetJobData, GetJobVariables>;
export function getJob(dc: DataConnect, vars: GetJobVariables, options?: ExecuteQueryOptions): QueryPromise<GetJobData, GetJobVariables>;

interface ListJobsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListJobsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListJobsData, undefined>;
  operationName: string;
}
export const listJobsRef: ListJobsRef;

export function listJobs(options?: ExecuteQueryOptions): QueryPromise<ListJobsData, undefined>;
export function listJobs(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListJobsData, undefined>;

interface CreateCategoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateCategoryData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateCategoryData, undefined>;
  operationName: string;
}
export const createCategoryRef: CreateCategoryRef;

export function createCategory(): MutationPromise<CreateCategoryData, undefined>;
export function createCategory(dc: DataConnect): MutationPromise<CreateCategoryData, undefined>;

interface UpdateCategoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCategoryVariables): MutationRef<UpdateCategoryData, UpdateCategoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateCategoryVariables): MutationRef<UpdateCategoryData, UpdateCategoryVariables>;
  operationName: string;
}
export const updateCategoryRef: UpdateCategoryRef;

export function updateCategory(vars: UpdateCategoryVariables): MutationPromise<UpdateCategoryData, UpdateCategoryVariables>;
export function updateCategory(dc: DataConnect, vars: UpdateCategoryVariables): MutationPromise<UpdateCategoryData, UpdateCategoryVariables>;

interface DeleteCategoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCategoryVariables): MutationRef<DeleteCategoryData, DeleteCategoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteCategoryVariables): MutationRef<DeleteCategoryData, DeleteCategoryVariables>;
  operationName: string;
}
export const deleteCategoryRef: DeleteCategoryRef;

export function deleteCategory(vars: DeleteCategoryVariables): MutationPromise<DeleteCategoryData, DeleteCategoryVariables>;
export function deleteCategory(dc: DataConnect, vars: DeleteCategoryVariables): MutationPromise<DeleteCategoryData, DeleteCategoryVariables>;

interface GetCategoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCategoryVariables): QueryRef<GetCategoryData, GetCategoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetCategoryVariables): QueryRef<GetCategoryData, GetCategoryVariables>;
  operationName: string;
}
export const getCategoryRef: GetCategoryRef;

export function getCategory(vars: GetCategoryVariables, options?: ExecuteQueryOptions): QueryPromise<GetCategoryData, GetCategoryVariables>;
export function getCategory(dc: DataConnect, vars: GetCategoryVariables, options?: ExecuteQueryOptions): QueryPromise<GetCategoryData, GetCategoryVariables>;

interface ListCategoriesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCategoriesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListCategoriesData, undefined>;
  operationName: string;
}
export const listCategoriesRef: ListCategoriesRef;

export function listCategories(options?: ExecuteQueryOptions): QueryPromise<ListCategoriesData, undefined>;
export function listCategories(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListCategoriesData, undefined>;

interface CreateStudyMaterialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateStudyMaterialVariables): MutationRef<CreateStudyMaterialData, CreateStudyMaterialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateStudyMaterialVariables): MutationRef<CreateStudyMaterialData, CreateStudyMaterialVariables>;
  operationName: string;
}
export const createStudyMaterialRef: CreateStudyMaterialRef;

export function createStudyMaterial(vars: CreateStudyMaterialVariables): MutationPromise<CreateStudyMaterialData, CreateStudyMaterialVariables>;
export function createStudyMaterial(dc: DataConnect, vars: CreateStudyMaterialVariables): MutationPromise<CreateStudyMaterialData, CreateStudyMaterialVariables>;

interface UpdateStudyMaterialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateStudyMaterialVariables): MutationRef<UpdateStudyMaterialData, UpdateStudyMaterialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateStudyMaterialVariables): MutationRef<UpdateStudyMaterialData, UpdateStudyMaterialVariables>;
  operationName: string;
}
export const updateStudyMaterialRef: UpdateStudyMaterialRef;

export function updateStudyMaterial(vars: UpdateStudyMaterialVariables): MutationPromise<UpdateStudyMaterialData, UpdateStudyMaterialVariables>;
export function updateStudyMaterial(dc: DataConnect, vars: UpdateStudyMaterialVariables): MutationPromise<UpdateStudyMaterialData, UpdateStudyMaterialVariables>;

interface DeleteStudyMaterialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteStudyMaterialVariables): MutationRef<DeleteStudyMaterialData, DeleteStudyMaterialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteStudyMaterialVariables): MutationRef<DeleteStudyMaterialData, DeleteStudyMaterialVariables>;
  operationName: string;
}
export const deleteStudyMaterialRef: DeleteStudyMaterialRef;

export function deleteStudyMaterial(vars: DeleteStudyMaterialVariables): MutationPromise<DeleteStudyMaterialData, DeleteStudyMaterialVariables>;
export function deleteStudyMaterial(dc: DataConnect, vars: DeleteStudyMaterialVariables): MutationPromise<DeleteStudyMaterialData, DeleteStudyMaterialVariables>;

interface GetStudyMaterialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetStudyMaterialVariables): QueryRef<GetStudyMaterialData, GetStudyMaterialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetStudyMaterialVariables): QueryRef<GetStudyMaterialData, GetStudyMaterialVariables>;
  operationName: string;
}
export const getStudyMaterialRef: GetStudyMaterialRef;

export function getStudyMaterial(vars: GetStudyMaterialVariables, options?: ExecuteQueryOptions): QueryPromise<GetStudyMaterialData, GetStudyMaterialVariables>;
export function getStudyMaterial(dc: DataConnect, vars: GetStudyMaterialVariables, options?: ExecuteQueryOptions): QueryPromise<GetStudyMaterialData, GetStudyMaterialVariables>;

interface ListStudyMaterialsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListStudyMaterialsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListStudyMaterialsData, undefined>;
  operationName: string;
}
export const listStudyMaterialsRef: ListStudyMaterialsRef;

export function listStudyMaterials(options?: ExecuteQueryOptions): QueryPromise<ListStudyMaterialsData, undefined>;
export function listStudyMaterials(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListStudyMaterialsData, undefined>;

interface CreateProgressRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProgressVariables): MutationRef<CreateProgressData, CreateProgressVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateProgressVariables): MutationRef<CreateProgressData, CreateProgressVariables>;
  operationName: string;
}
export const createProgressRef: CreateProgressRef;

export function createProgress(vars: CreateProgressVariables): MutationPromise<CreateProgressData, CreateProgressVariables>;
export function createProgress(dc: DataConnect, vars: CreateProgressVariables): MutationPromise<CreateProgressData, CreateProgressVariables>;

interface UpdateProgressRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProgressVariables): MutationRef<UpdateProgressData, UpdateProgressVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateProgressVariables): MutationRef<UpdateProgressData, UpdateProgressVariables>;
  operationName: string;
}
export const updateProgressRef: UpdateProgressRef;

export function updateProgress(vars: UpdateProgressVariables): MutationPromise<UpdateProgressData, UpdateProgressVariables>;
export function updateProgress(dc: DataConnect, vars: UpdateProgressVariables): MutationPromise<UpdateProgressData, UpdateProgressVariables>;

interface DeleteProgressRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteProgressVariables): MutationRef<DeleteProgressData, DeleteProgressVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteProgressVariables): MutationRef<DeleteProgressData, DeleteProgressVariables>;
  operationName: string;
}
export const deleteProgressRef: DeleteProgressRef;

export function deleteProgress(vars: DeleteProgressVariables): MutationPromise<DeleteProgressData, DeleteProgressVariables>;
export function deleteProgress(dc: DataConnect, vars: DeleteProgressVariables): MutationPromise<DeleteProgressData, DeleteProgressVariables>;

interface GetProgressRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetProgressVariables): QueryRef<GetProgressData, GetProgressVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetProgressVariables): QueryRef<GetProgressData, GetProgressVariables>;
  operationName: string;
}
export const getProgressRef: GetProgressRef;

export function getProgress(vars: GetProgressVariables, options?: ExecuteQueryOptions): QueryPromise<GetProgressData, GetProgressVariables>;
export function getProgress(dc: DataConnect, vars: GetProgressVariables, options?: ExecuteQueryOptions): QueryPromise<GetProgressData, GetProgressVariables>;

interface ListProgressesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListProgressesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListProgressesData, undefined>;
  operationName: string;
}
export const listProgressesRef: ListProgressesRef;

export function listProgresses(options?: ExecuteQueryOptions): QueryPromise<ListProgressesData, undefined>;
export function listProgresses(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListProgressesData, undefined>;

interface SaveJobRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SaveJobVariables): MutationRef<SaveJobData, SaveJobVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SaveJobVariables): MutationRef<SaveJobData, SaveJobVariables>;
  operationName: string;
}
export const saveJobRef: SaveJobRef;

export function saveJob(vars: SaveJobVariables): MutationPromise<SaveJobData, SaveJobVariables>;
export function saveJob(dc: DataConnect, vars: SaveJobVariables): MutationPromise<SaveJobData, SaveJobVariables>;

interface DeleteSavedJobRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSavedJobVariables): MutationRef<DeleteSavedJobData, DeleteSavedJobVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteSavedJobVariables): MutationRef<DeleteSavedJobData, DeleteSavedJobVariables>;
  operationName: string;
}
export const deleteSavedJobRef: DeleteSavedJobRef;

export function deleteSavedJob(vars: DeleteSavedJobVariables): MutationPromise<DeleteSavedJobData, DeleteSavedJobVariables>;
export function deleteSavedJob(dc: DataConnect, vars: DeleteSavedJobVariables): MutationPromise<DeleteSavedJobData, DeleteSavedJobVariables>;

interface ListSavedJobsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListSavedJobsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListSavedJobsData, undefined>;
  operationName: string;
}
export const listSavedJobsRef: ListSavedJobsRef;

export function listSavedJobs(options?: ExecuteQueryOptions): QueryPromise<ListSavedJobsData, undefined>;
export function listSavedJobs(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListSavedJobsData, undefined>;

interface SaveMaterialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SaveMaterialVariables): MutationRef<SaveMaterialData, SaveMaterialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SaveMaterialVariables): MutationRef<SaveMaterialData, SaveMaterialVariables>;
  operationName: string;
}
export const saveMaterialRef: SaveMaterialRef;

export function saveMaterial(vars: SaveMaterialVariables): MutationPromise<SaveMaterialData, SaveMaterialVariables>;
export function saveMaterial(dc: DataConnect, vars: SaveMaterialVariables): MutationPromise<SaveMaterialData, SaveMaterialVariables>;

interface DeleteSavedMaterialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSavedMaterialVariables): MutationRef<DeleteSavedMaterialData, DeleteSavedMaterialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteSavedMaterialVariables): MutationRef<DeleteSavedMaterialData, DeleteSavedMaterialVariables>;
  operationName: string;
}
export const deleteSavedMaterialRef: DeleteSavedMaterialRef;

export function deleteSavedMaterial(vars: DeleteSavedMaterialVariables): MutationPromise<DeleteSavedMaterialData, DeleteSavedMaterialVariables>;
export function deleteSavedMaterial(dc: DataConnect, vars: DeleteSavedMaterialVariables): MutationPromise<DeleteSavedMaterialData, DeleteSavedMaterialVariables>;

interface ListSavedMaterialsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListSavedMaterialsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListSavedMaterialsData, undefined>;
  operationName: string;
}
export const listSavedMaterialsRef: ListSavedMaterialsRef;

export function listSavedMaterials(options?: ExecuteQueryOptions): QueryPromise<ListSavedMaterialsData, undefined>;
export function listSavedMaterials(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListSavedMaterialsData, undefined>;

interface ApplyForJobRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ApplyForJobVariables): MutationRef<ApplyForJobData, ApplyForJobVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ApplyForJobVariables): MutationRef<ApplyForJobData, ApplyForJobVariables>;
  operationName: string;
}
export const applyForJobRef: ApplyForJobRef;

export function applyForJob(vars: ApplyForJobVariables): MutationPromise<ApplyForJobData, ApplyForJobVariables>;
export function applyForJob(dc: DataConnect, vars: ApplyForJobVariables): MutationPromise<ApplyForJobData, ApplyForJobVariables>;

interface DeleteApplicationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteApplicationVariables): MutationRef<DeleteApplicationData, DeleteApplicationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteApplicationVariables): MutationRef<DeleteApplicationData, DeleteApplicationVariables>;
  operationName: string;
}
export const deleteApplicationRef: DeleteApplicationRef;

export function deleteApplication(vars: DeleteApplicationVariables): MutationPromise<DeleteApplicationData, DeleteApplicationVariables>;
export function deleteApplication(dc: DataConnect, vars: DeleteApplicationVariables): MutationPromise<DeleteApplicationData, DeleteApplicationVariables>;

interface ListApplicationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListApplicationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListApplicationsData, undefined>;
  operationName: string;
}
export const listApplicationsRef: ListApplicationsRef;

export function listApplications(options?: ExecuteQueryOptions): QueryPromise<ListApplicationsData, undefined>;
export function listApplications(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListApplicationsData, undefined>;

