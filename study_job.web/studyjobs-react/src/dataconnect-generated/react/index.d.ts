import { CreateUserData, UpdateUserData, UpdateUserVariables, DeleteUserData, DeleteUserVariables, GetUserData, GetUserVariables, ListUsersData, CreateJobData, UpdateJobData, UpdateJobVariables, DeleteJobData, DeleteJobVariables, GetJobData, GetJobVariables, ListJobsData, CreateCategoryData, UpdateCategoryData, UpdateCategoryVariables, DeleteCategoryData, DeleteCategoryVariables, GetCategoryData, GetCategoryVariables, ListCategoriesData, CreateStudyMaterialData, CreateStudyMaterialVariables, UpdateStudyMaterialData, UpdateStudyMaterialVariables, DeleteStudyMaterialData, DeleteStudyMaterialVariables, GetStudyMaterialData, GetStudyMaterialVariables, ListStudyMaterialsData, CreateProgressData, CreateProgressVariables, UpdateProgressData, UpdateProgressVariables, DeleteProgressData, DeleteProgressVariables, GetProgressData, GetProgressVariables, ListProgressesData, SaveJobData, SaveJobVariables, DeleteSavedJobData, DeleteSavedJobVariables, ListSavedJobsData, SaveMaterialData, SaveMaterialVariables, DeleteSavedMaterialData, DeleteSavedMaterialVariables, ListSavedMaterialsData, ApplyForJobData, ApplyForJobVariables, DeleteApplicationData, DeleteApplicationVariables, ListApplicationsData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;

export function useUpdateUser(options?: useDataConnectMutationOptions<UpdateUserData, FirebaseError, UpdateUserVariables>): UseDataConnectMutationResult<UpdateUserData, UpdateUserVariables>;
export function useUpdateUser(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateUserData, FirebaseError, UpdateUserVariables>): UseDataConnectMutationResult<UpdateUserData, UpdateUserVariables>;

export function useDeleteUser(options?: useDataConnectMutationOptions<DeleteUserData, FirebaseError, DeleteUserVariables>): UseDataConnectMutationResult<DeleteUserData, DeleteUserVariables>;
export function useDeleteUser(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteUserData, FirebaseError, DeleteUserVariables>): UseDataConnectMutationResult<DeleteUserData, DeleteUserVariables>;

export function useGetUser(vars: GetUserVariables, options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, GetUserVariables>;
export function useGetUser(dc: DataConnect, vars: GetUserVariables, options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, GetUserVariables>;

export function useListUsers(options?: useDataConnectQueryOptions<ListUsersData>): UseDataConnectQueryResult<ListUsersData, undefined>;
export function useListUsers(dc: DataConnect, options?: useDataConnectQueryOptions<ListUsersData>): UseDataConnectQueryResult<ListUsersData, undefined>;

export function useCreateJob(options?: useDataConnectMutationOptions<CreateJobData, FirebaseError, void>): UseDataConnectMutationResult<CreateJobData, undefined>;
export function useCreateJob(dc: DataConnect, options?: useDataConnectMutationOptions<CreateJobData, FirebaseError, void>): UseDataConnectMutationResult<CreateJobData, undefined>;

export function useUpdateJob(options?: useDataConnectMutationOptions<UpdateJobData, FirebaseError, UpdateJobVariables>): UseDataConnectMutationResult<UpdateJobData, UpdateJobVariables>;
export function useUpdateJob(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateJobData, FirebaseError, UpdateJobVariables>): UseDataConnectMutationResult<UpdateJobData, UpdateJobVariables>;

export function useDeleteJob(options?: useDataConnectMutationOptions<DeleteJobData, FirebaseError, DeleteJobVariables>): UseDataConnectMutationResult<DeleteJobData, DeleteJobVariables>;
export function useDeleteJob(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteJobData, FirebaseError, DeleteJobVariables>): UseDataConnectMutationResult<DeleteJobData, DeleteJobVariables>;

export function useGetJob(vars: GetJobVariables, options?: useDataConnectQueryOptions<GetJobData>): UseDataConnectQueryResult<GetJobData, GetJobVariables>;
export function useGetJob(dc: DataConnect, vars: GetJobVariables, options?: useDataConnectQueryOptions<GetJobData>): UseDataConnectQueryResult<GetJobData, GetJobVariables>;

export function useListJobs(options?: useDataConnectQueryOptions<ListJobsData>): UseDataConnectQueryResult<ListJobsData, undefined>;
export function useListJobs(dc: DataConnect, options?: useDataConnectQueryOptions<ListJobsData>): UseDataConnectQueryResult<ListJobsData, undefined>;

export function useCreateCategory(options?: useDataConnectMutationOptions<CreateCategoryData, FirebaseError, void>): UseDataConnectMutationResult<CreateCategoryData, undefined>;
export function useCreateCategory(dc: DataConnect, options?: useDataConnectMutationOptions<CreateCategoryData, FirebaseError, void>): UseDataConnectMutationResult<CreateCategoryData, undefined>;

export function useUpdateCategory(options?: useDataConnectMutationOptions<UpdateCategoryData, FirebaseError, UpdateCategoryVariables>): UseDataConnectMutationResult<UpdateCategoryData, UpdateCategoryVariables>;
export function useUpdateCategory(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateCategoryData, FirebaseError, UpdateCategoryVariables>): UseDataConnectMutationResult<UpdateCategoryData, UpdateCategoryVariables>;

export function useDeleteCategory(options?: useDataConnectMutationOptions<DeleteCategoryData, FirebaseError, DeleteCategoryVariables>): UseDataConnectMutationResult<DeleteCategoryData, DeleteCategoryVariables>;
export function useDeleteCategory(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteCategoryData, FirebaseError, DeleteCategoryVariables>): UseDataConnectMutationResult<DeleteCategoryData, DeleteCategoryVariables>;

export function useGetCategory(vars: GetCategoryVariables, options?: useDataConnectQueryOptions<GetCategoryData>): UseDataConnectQueryResult<GetCategoryData, GetCategoryVariables>;
export function useGetCategory(dc: DataConnect, vars: GetCategoryVariables, options?: useDataConnectQueryOptions<GetCategoryData>): UseDataConnectQueryResult<GetCategoryData, GetCategoryVariables>;

export function useListCategories(options?: useDataConnectQueryOptions<ListCategoriesData>): UseDataConnectQueryResult<ListCategoriesData, undefined>;
export function useListCategories(dc: DataConnect, options?: useDataConnectQueryOptions<ListCategoriesData>): UseDataConnectQueryResult<ListCategoriesData, undefined>;

export function useCreateStudyMaterial(options?: useDataConnectMutationOptions<CreateStudyMaterialData, FirebaseError, CreateStudyMaterialVariables>): UseDataConnectMutationResult<CreateStudyMaterialData, CreateStudyMaterialVariables>;
export function useCreateStudyMaterial(dc: DataConnect, options?: useDataConnectMutationOptions<CreateStudyMaterialData, FirebaseError, CreateStudyMaterialVariables>): UseDataConnectMutationResult<CreateStudyMaterialData, CreateStudyMaterialVariables>;

export function useUpdateStudyMaterial(options?: useDataConnectMutationOptions<UpdateStudyMaterialData, FirebaseError, UpdateStudyMaterialVariables>): UseDataConnectMutationResult<UpdateStudyMaterialData, UpdateStudyMaterialVariables>;
export function useUpdateStudyMaterial(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateStudyMaterialData, FirebaseError, UpdateStudyMaterialVariables>): UseDataConnectMutationResult<UpdateStudyMaterialData, UpdateStudyMaterialVariables>;

export function useDeleteStudyMaterial(options?: useDataConnectMutationOptions<DeleteStudyMaterialData, FirebaseError, DeleteStudyMaterialVariables>): UseDataConnectMutationResult<DeleteStudyMaterialData, DeleteStudyMaterialVariables>;
export function useDeleteStudyMaterial(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteStudyMaterialData, FirebaseError, DeleteStudyMaterialVariables>): UseDataConnectMutationResult<DeleteStudyMaterialData, DeleteStudyMaterialVariables>;

export function useGetStudyMaterial(vars: GetStudyMaterialVariables, options?: useDataConnectQueryOptions<GetStudyMaterialData>): UseDataConnectQueryResult<GetStudyMaterialData, GetStudyMaterialVariables>;
export function useGetStudyMaterial(dc: DataConnect, vars: GetStudyMaterialVariables, options?: useDataConnectQueryOptions<GetStudyMaterialData>): UseDataConnectQueryResult<GetStudyMaterialData, GetStudyMaterialVariables>;

export function useListStudyMaterials(options?: useDataConnectQueryOptions<ListStudyMaterialsData>): UseDataConnectQueryResult<ListStudyMaterialsData, undefined>;
export function useListStudyMaterials(dc: DataConnect, options?: useDataConnectQueryOptions<ListStudyMaterialsData>): UseDataConnectQueryResult<ListStudyMaterialsData, undefined>;

export function useCreateProgress(options?: useDataConnectMutationOptions<CreateProgressData, FirebaseError, CreateProgressVariables>): UseDataConnectMutationResult<CreateProgressData, CreateProgressVariables>;
export function useCreateProgress(dc: DataConnect, options?: useDataConnectMutationOptions<CreateProgressData, FirebaseError, CreateProgressVariables>): UseDataConnectMutationResult<CreateProgressData, CreateProgressVariables>;

export function useUpdateProgress(options?: useDataConnectMutationOptions<UpdateProgressData, FirebaseError, UpdateProgressVariables>): UseDataConnectMutationResult<UpdateProgressData, UpdateProgressVariables>;
export function useUpdateProgress(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateProgressData, FirebaseError, UpdateProgressVariables>): UseDataConnectMutationResult<UpdateProgressData, UpdateProgressVariables>;

export function useDeleteProgress(options?: useDataConnectMutationOptions<DeleteProgressData, FirebaseError, DeleteProgressVariables>): UseDataConnectMutationResult<DeleteProgressData, DeleteProgressVariables>;
export function useDeleteProgress(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteProgressData, FirebaseError, DeleteProgressVariables>): UseDataConnectMutationResult<DeleteProgressData, DeleteProgressVariables>;

export function useGetProgress(vars: GetProgressVariables, options?: useDataConnectQueryOptions<GetProgressData>): UseDataConnectQueryResult<GetProgressData, GetProgressVariables>;
export function useGetProgress(dc: DataConnect, vars: GetProgressVariables, options?: useDataConnectQueryOptions<GetProgressData>): UseDataConnectQueryResult<GetProgressData, GetProgressVariables>;

export function useListProgresses(options?: useDataConnectQueryOptions<ListProgressesData>): UseDataConnectQueryResult<ListProgressesData, undefined>;
export function useListProgresses(dc: DataConnect, options?: useDataConnectQueryOptions<ListProgressesData>): UseDataConnectQueryResult<ListProgressesData, undefined>;

export function useSaveJob(options?: useDataConnectMutationOptions<SaveJobData, FirebaseError, SaveJobVariables>): UseDataConnectMutationResult<SaveJobData, SaveJobVariables>;
export function useSaveJob(dc: DataConnect, options?: useDataConnectMutationOptions<SaveJobData, FirebaseError, SaveJobVariables>): UseDataConnectMutationResult<SaveJobData, SaveJobVariables>;

export function useDeleteSavedJob(options?: useDataConnectMutationOptions<DeleteSavedJobData, FirebaseError, DeleteSavedJobVariables>): UseDataConnectMutationResult<DeleteSavedJobData, DeleteSavedJobVariables>;
export function useDeleteSavedJob(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteSavedJobData, FirebaseError, DeleteSavedJobVariables>): UseDataConnectMutationResult<DeleteSavedJobData, DeleteSavedJobVariables>;

export function useListSavedJobs(options?: useDataConnectQueryOptions<ListSavedJobsData>): UseDataConnectQueryResult<ListSavedJobsData, undefined>;
export function useListSavedJobs(dc: DataConnect, options?: useDataConnectQueryOptions<ListSavedJobsData>): UseDataConnectQueryResult<ListSavedJobsData, undefined>;

export function useSaveMaterial(options?: useDataConnectMutationOptions<SaveMaterialData, FirebaseError, SaveMaterialVariables>): UseDataConnectMutationResult<SaveMaterialData, SaveMaterialVariables>;
export function useSaveMaterial(dc: DataConnect, options?: useDataConnectMutationOptions<SaveMaterialData, FirebaseError, SaveMaterialVariables>): UseDataConnectMutationResult<SaveMaterialData, SaveMaterialVariables>;

export function useDeleteSavedMaterial(options?: useDataConnectMutationOptions<DeleteSavedMaterialData, FirebaseError, DeleteSavedMaterialVariables>): UseDataConnectMutationResult<DeleteSavedMaterialData, DeleteSavedMaterialVariables>;
export function useDeleteSavedMaterial(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteSavedMaterialData, FirebaseError, DeleteSavedMaterialVariables>): UseDataConnectMutationResult<DeleteSavedMaterialData, DeleteSavedMaterialVariables>;

export function useListSavedMaterials(options?: useDataConnectQueryOptions<ListSavedMaterialsData>): UseDataConnectQueryResult<ListSavedMaterialsData, undefined>;
export function useListSavedMaterials(dc: DataConnect, options?: useDataConnectQueryOptions<ListSavedMaterialsData>): UseDataConnectQueryResult<ListSavedMaterialsData, undefined>;

export function useApplyForJob(options?: useDataConnectMutationOptions<ApplyForJobData, FirebaseError, ApplyForJobVariables>): UseDataConnectMutationResult<ApplyForJobData, ApplyForJobVariables>;
export function useApplyForJob(dc: DataConnect, options?: useDataConnectMutationOptions<ApplyForJobData, FirebaseError, ApplyForJobVariables>): UseDataConnectMutationResult<ApplyForJobData, ApplyForJobVariables>;

export function useDeleteApplication(options?: useDataConnectMutationOptions<DeleteApplicationData, FirebaseError, DeleteApplicationVariables>): UseDataConnectMutationResult<DeleteApplicationData, DeleteApplicationVariables>;
export function useDeleteApplication(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteApplicationData, FirebaseError, DeleteApplicationVariables>): UseDataConnectMutationResult<DeleteApplicationData, DeleteApplicationVariables>;

export function useListApplications(options?: useDataConnectQueryOptions<ListApplicationsData>): UseDataConnectQueryResult<ListApplicationsData, undefined>;
export function useListApplications(dc: DataConnect, options?: useDataConnectQueryOptions<ListApplicationsData>): UseDataConnectQueryResult<ListApplicationsData, undefined>;
