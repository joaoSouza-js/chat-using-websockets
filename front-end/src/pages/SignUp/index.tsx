import * as z from "zod"
import { useForm } from "react-hook-form"
import {useNavigate} from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"

import { useAuth } from "@/hooks/useAuth";
import { AppError } from "@/services/appError";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const newUserSchema = z.object({
    email: z.string({ required_error: "Email é obrigatório" }).email("Email está inválido"),
    username: z.string({ required_error: "Nome de usuário é obrigatório" })
        .min(4, "O nome deve possuir mais de 4 letras")
        .refine(username => username.trim().length >= 4, "o nome deve possuir mais de 4 letras")
        .transform(username => username.trim())
    ,
    password: z.string({ required_error: "Senha é obrigatória" }).min(6, "Senha deve ter pelo mes 6 caracteres")
})

type newUserSchemaData = z.input<typeof newUserSchema>

export function SignUp() {
    const { signUp } = useAuth()
    const navigation = useNavigate()
    const { formState, handleSubmit, register } = useForm<newUserSchemaData>({
        resolver: zodResolver(newUserSchema)
    })

    const { errors, isSubmitting } = formState

    async function handleRegisterUser(form: newUserSchemaData) {
        try {
            await signUp({
                email: form.email,
                password: form.password,
                username: form.username
            })
            navigation("/home")
        } catch (error) {
            const isAppError = error instanceof AppError
            const errorMessage = isAppError ? error.error : "Algo de errado com o servidor"
            window.alert(errorMessage)
        }


   
    }
    return (
        <div className="min-h-screen flex justify-center items-center">
            <form onSubmit={handleSubmit(handleRegisterUser)}>
                <Card className="py-4 px-4 min-w-[320px]  flex flex-col bg-gray-100 shadow-2xl">
                    <h1
                        className="text-center font-semibold text-lg text-gray-700"
                    >
                        Cria a sua conta
                    </h1>
                    <div className="mt-3">
                        <div className="flex flex-col gap-3">
                            <label className="flex-col ">
                                <span className="text-sm text-muted-foreground inline-block font-semibold">Email</span>
                                <Input
                                    className="mt-1"
                                    placeholder="Digite o seu Email"
                                    {...register("email")}

                                />
                                {
                                    errors.email?.message && (
                                        <span className="text-destructive text-xs  font-medium">
                                            {errors.email.message}
                                        </span>
                                    )
                                }

                            </label>
                            <label className="flex-col ">
                                <span className="text-sm text-muted-foreground inline-block font-semibold">Usuário</span>
                                <Input
                                    className="mt-1"
                                    {...register("username")}
                                    placeholder="Digite o seu Nome de usuário"

                                />
                                {
                                    errors.username?.message && (
                                        <span className="text-destructive text-xs  font-medium">
                                            {errors.username.message}
                                        </span>
                                    )
                                }

                            </label>
                            <label className="flex-col ">
                                <span className="text-sm text-muted-foreground inline-block font-semibold">Senha</span>
                                <Input
                                    className="mt-1"
                                    {...register("password")}
                                    placeholder="Digite a sua senha"

                                />
                                {
                                    errors.password?.message && (
                                        <span className="text-destructive text-xs  font-medium">
                                            {errors.password.message}
                                        </span>
                                    )
                                }

                            </label>

                        </div>

                        <div
                            className="flex flex-col gap-1 mt-4"
                        >
                            <Button

                                disabled={isSubmitting}
                                type="submit"
                            >
                                Criar
                            </Button>
                        </div>

                    </div>
                </Card>

            </form>
        </div>
    )
}