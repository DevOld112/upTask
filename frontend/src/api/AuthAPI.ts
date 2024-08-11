import { UserRegistrationForm, ConfirmToken, RequestConfirmationCodeForm, UserLoginForm, ForgotPasswordForm, NewPasswordForm } from "@/types/index";
import api from "../lib/axios";
import { isAxiosError } from "axios"

export async function registerUser (formData : UserRegistrationForm){
    try {
        const url = '/auth/create-account'
        const { data } = await api.post<string>(url, formData)
        console.log(data)

        return data;
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function confirmAccount(formData : ConfirmToken){ 
    try {
        const url = '/auth/confirm-account'
        const { data } = await api.post<string>(url, formData)

        return data;
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function requestCode(formData: RequestConfirmationCodeForm) {
    try {
        const url = '/auth/request-code'
        const { data } = await api.post<string>(url, formData)

        return data;
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function loginUser(formData: UserLoginForm){
    try {
        const url = '/auth/login'
        const { data } = await api.post<string>(url, formData)

        return data;
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function forgetPassword(formData: ForgotPasswordForm){
    try {
        const url = '/auth/forgot-password'
        const { data } = await api.post<string>(url, formData)

        return data;
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function validateToken(formData: ConfirmToken){ 
    try {
        const url = '/auth/validate-token'
        const { data } = await api.post<string>(url, formData)

        return data;
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function updatePasswordWithToken({formData, token}: {formData: NewPasswordForm, token: ConfirmToken['token']}){ 
        try {
            const url = `/auth/reset-password/${token}`
            const { data } = await api.post<string>(url, formData)
    
            return data;
        } catch (error) {
            if(isAxiosError(error) && error.response){
                throw new Error(error.response.data.error)
            }
        }
}