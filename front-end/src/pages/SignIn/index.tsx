import * as z from "zod"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod"

import { AppError } from "@/services/appError";
import { useAuth } from "@/hooks/useAuth";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


const SignInSchema = z.object({
    email: z.string({ required_error: "Email é obrigatório" }).email("Email está inválido"),
    password: z.string({ required_error: "Senha é obrigatória" }).min(1, "Senha é obrigatória")
})

type SignInSchemaData = z.input<typeof SignInSchema>

export function SignIn() {
    const {signIn} = useAuth()
    const navigate = useNavigate()

    const { formState, handleSubmit, register } = useForm<SignInSchemaData>({
        resolver: zodResolver(SignInSchema)
    })

    const { errors, isSubmitting } = formState

    async function handleRegisterUser(form: SignInSchemaData) {
        try {
            await signIn({
                email: form.email,
                password: form.password
            })
            navigate("/home")
        } catch (error) {
            const isAppError = error instanceof AppError
            const errorMessage = isAppError ? error.error : "error no servidor"
            window.alert(errorMessage)
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center">
            <form onSubmit={handleSubmit(handleRegisterUser)}>
                <Card className="py-4 px-4 min-w-[320px]  flex flex-col" >
                    <h1
                        className="text-center font-semibold text-lg text-gray-700"
                    >
                        Acesse a sua Conta
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
                                        <span className="text-destructive text-xs  font-semibold">
                                            {errors.email.message}
                                        </span>
                                    )
                                }

                            </label>

                            <label className="flex-col ">
                                <span className="text-sm text-muted-foreground inline-block font-semibold">Senha</span>
                                <Input
                                    {...register("password")}

                                    className="mt-1"
                                    placeholder="Digite a sua senha"

                                />
                                {
                                    errors.password?.message && (
                                        <span className="text-destructive text-xs  font-semibold">
                                            {errors.password.message}
                                        </span>
                                    )
                                }

                            </label>

                        </div>

                        <div className="flex flex-col gap-2 mt-4">

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                            >
                                Entrar
                            </Button>

                            <Link
                                to={"/"}
                                className="text-sm text-gray-700 block text-center"
                            >
                                Esqueceu a senha?
                            </Link>

                            <Button asChild>
                                <Link to={"/signUp"}>
                                    Criar uma nova conta
                                </Link>
                            </Button>

                        </div>

                    </div>
                </Card>

            </form>
        </div>
    )
}