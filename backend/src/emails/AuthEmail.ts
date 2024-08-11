import { transporter } from "../config/nodemailer"

interface IEmail {
    email: string,
    name: string,
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async(user : IEmail) => {
                await transporter.sendMail({
                from: 'UpTask <admin@upTask.com>',
                to: user.email,
                subject: 'UpTask - Confirma tu Cuenta',
                text: 'UpTask - Confirma tu Cuenta',
                html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
                    <header style="text-align: center; background-color: #007bff; padding: 10px; border-radius: 10px 10px 0 0;">
                        <h1 style="color: #fff;">UpTask</h1>
                    </header>
                    <div style="padding: 20px; text-align: center;">
                        <h2 style="color: #333;">Hola, ${user.name}</h2>
                        <p style="color: #666;">¡Gracias por registrarte en UpTask! Estamos emocionados de que te unas a nuestra comunidad. Para completar tu registro y activar tu cuenta, por favor confirma tu correo electrónico haciendo clic en el siguiente enlace, NO olvidar que tu token es ${user.token}:</p>
                        <a href="${process.env.FRONTEND_URL}/auth/confirm-account/" style="display: inline-block; margin: 20px 0; padding: 15px 30px; color: #fff; background-color: #28a745; text-decoration: none; border-radius: 5px; font-size: 16px;">Confirma tu Cuenta</a>
                        <p style="color: #666;">Si no creaste esta cuenta, puedes ignorar este correo. Si necesitas ayuda, no dudes en <a href="https://www.uptask.com/support" style="color: #007bff;">contactar a nuestro soporte</a>.</p>
                        <hr style="margin: 20px 0; border: 0; border-top: 1px solid #e0e0e0;">
                        <footer style="text-align: center; color: #999;">
                            <p>© 2024 UpTask. Todos los derechos reservados.</p>
                            <p><a href="https://www.uptask.com/privacy" style="color: #007bff;">Política de Privacidad</a> | <a href="https://www.uptask.com/terms" style="color: #007bff;">Términos de Servicio</a></p>
                        </footer>
                    </div>
                </div>
            `
            })
    }

    static sendPasswordResetToken = async(user : IEmail) => {
        await transporter.sendMail({
        from: 'UpTask <admin@upTask.com>',
        to: user.email,
        subject: 'UpTask - Restablece tu Password',
        text: 'UpTask - Restablece tu Password',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
            <header style="text-align: center; background-color: #007bff; padding: 10px; border-radius: 10px 10px 0 0;">
                <h1 style="color: #fff;">UpTask</h1>
            </header>
            <div style="padding: 20px; text-align: center;">
                <h2 style="color: #333;">Hola, ${user.name}</h2>
                <p style="color: #666;">¡Gracias por registrarte en UpTask! Estamos emocionados de que te unas a nuestra comunidad. Para completar tu registro y activar tu cuenta, por favor confirma tu correo electrónico haciendo clic en el siguiente enlace, NO olvidar que tu token es ${user.token}:</p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password/${user.token}" style="display: inline-block; margin: 20px 0; padding: 15px 30px; color: #fff; background-color: #28a745; text-decoration: none; border-radius: 5px; font-size: 16px;">Restablece tu Contraseña</a>
                <p style="color: #666;">Si no creaste esta cuenta, puedes ignorar este correo. Si necesitas ayuda, no dudes en <a href="https://www.uptask.com/support" style="color: #007bff;">contactar a nuestro soporte</a>.</p>
                <hr style="margin: 20px 0; border: 0; border-top: 1px solid #e0e0e0;">
                <footer style="text-align: center; color: #999;">
                    <p>© 2024 UpTask. Todos los derechos reservados.</p>
                    <p><a href="https://www.uptask.com/privacy" style="color: #007bff;">Política de Privacidad</a> | <a href="https://www.uptask.com/terms" style="color: #007bff;">Términos de Servicio</a></p>
                </footer>
            </div>
        </div>
    `
    })
}
}