import Mail from "nodemailer/lib/mailer";
import { ApiError } from "../api/errorApi";
import { OrderProducts } from "../interfaces/orders";
import { UserAddresses } from "../interfaces/users";
import { createTransporter } from "../services/email";
import { logger } from "../services/logger";

export const htmlGeneral = `<!doctype html>
<html>
  <head>
    <meta name="viewport" contsent="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>New order html email</title>
  </head>
  <body><table ="container" style="margin: auto; background-color: white; width: 80%; padding: 0.5rem; text-align: center; font-family: 'Helvetica', sans-seriff;" width="80%" bgcolor="white" align="center">
  <tr>
    <td>
      <div ="header-container" style="background-color: #f1faee; border-radius: 0.4rem; max-height: 10rem; padding: 1rem; margin-bottom: 0.2rem;">
        <img src="https://www.seekpng.com/png/full/428-4289671_logo-e-commerce-good-e-commerce-logo.png" alt="" style="width: auto; max-height: 5rem;">
      </div>
    </td>
  </tr>
  <tr>
    <td>
      <div ="main-container">`;

export const htmlFooter = `</div></td></tr></table></body></html>`;

export class EmailUtilities {
  /**
   *
   * @param to recipient.
   * @param subject subject of the email.
   * @param content content of the email.
   *
   * The function creates the mailOptions object, create a transporter for sending it and
   * call the asynchronous function of sending the email.
   * No returning value.
   */

  static sendEmail = async (
    to: string,
    subject: string,
    content: string
  ): Promise<void> => {
    const mailOptions: Mail.Options = {
      to: to,
      subject: subject,
      html: content,
      replyTo: "mansonlautaro@gmail.com",
    };
    try {
      const transporterResult = await createTransporter();
      if (transporterResult instanceof ApiError) {
        logger.error(`Error: ${transporterResult.error}. Message: ${transporterResult.message}. Stack: ${transporterResult.stack}`);
      } else await transporterResult.sendMail(mailOptions);
    } catch (error) {
      logger.error(`Error: ${(error as any).error}. Message: ${(error as any).message}. Stack: ${(error as any).stack}`);
    }
  };

  /**
   * Function for creating the address HTML Format of the order email. It contains the
   * validations of the possible null address values such as street 2 & 3, floor or department.
   *
   * @param address the complete user address where the order should be delivered.
   * @returns the HTML formatted address.
   */

  static addressHTMLFormat = (address: UserAddresses): string => {
    return `${address.street1.name} ${address.street1.number}${
      address.department ? ` ${address.department}` : ""
    }${address.floor ? ` ${address.floor}` : ""}, ${
      !address.street2
        ? ""
        : address.street3
        ? `near ${address.street2} and ${address.street3},`
        : `near ${address.street2}, `
    }${address.city} ${address.zipcode}`;
  };

  /**
   * Function for creating the order email.
   *
   * @param products the order products.
   * @param htmlAddress the HTML formatted address.
   * @param total the total of the order.
   * @param customerOrAdminMessages an array containing two messages for the receiver of the
   * email, defined at the controller.
   * @returns the HTML order email string ready to be sent to the sender function.
   *
   */

  static createHTMLOrderEmail = (
    products: OrderProducts[],
    htmlAddress: string,
    total: number,
    customerOrAdminMessages: [string, string]
  ): string => {
    const productsHTML: string =
      products.length > 1
        ? products
            .map((product) => {
              return `<p ="products-list" style="text-align: left; margin-left: 2.5rem;">
                        ${product.product_title} x${
                product.quantity
              } <span style="margin-left:0.2rem; font-size: 1.2rem; color: green;">${
                product.price * product.quantity
              }</span>
                        </p>`;
            })
            .join()
        : [
            `<p ="products-list" style="text-align: left; margin-left: 2.5rem;">
                    ${products[0].product_title} x${
              products[0].quantity
            } <span style="margin-left:0.2rem; font-size: 1.2rem; color: green;">${
              products[0].price * products[0].quantity
            }</span>
                </p>`,
          ].toString();

    const htmlTotal = `<p ="order-text" style="font-size: 1.2rem; text-align: left; margin-left: 1.2rem;">
                <b>Total:</b> <span ="price" style="margin-left: 0.5rem; font-size: 1.5rem; color: green;">${total}</span>
                </p>`;

    return htmlGeneral
      .concat(
        `<h2>${customerOrAdminMessages[0]}</h2><h4>Here are the details:</h4>`.concat(
          productsHTML.concat(htmlTotal)
        )
          .concat(`<p ="order-text" style="font-size: 1.2rem; text-align: left; margin-left: 1.2rem;">
        ${customerOrAdminMessages[1]}: <b>${htmlAddress}</b>
      </p>`)
      )
      .concat(htmlFooter);
  };
}
