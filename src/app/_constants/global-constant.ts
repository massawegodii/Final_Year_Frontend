export class GlobalConstant{
    // Message
    public static genericError: string = "Something went wrong. Please try again later";

    public static unauthorized: string = "You are not authorize person to access this page.";

    public static productExistError: string = "Product Already Exists";

    public static productAdded: string = "Product Added Successfully";

    //Regex
    public static nameRegex: string = "[a-zA-Z0-9 ]*";
    public static emailRegex: string = "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}";
    public static contactNumberRegex: string = "^[e0-9]{10,10}$";
    public static number: string = '^[0-9]*$';


    //Variable
    public static error: string = "error";
}