import { CardWrapperProps } from "@/types/form";

import {
  Card, CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
const CardWrapper = ({
  title,
  label,
  backButtonHref,
  backButtonLabel,
  children,
}: CardWrapperProps) => {
  return (
    <Card className="w-full max-w-sm flex items-center flex-col ">
      <CardHeader className=" w-full flex flex-col items-center justify-center gap-y-4 ">
        <AuthHeader title={title} label={label} />
        <CardContent className="w-full p-0">{children}</CardContent>
        <CardFooter>
          <BackButton label={backButtonLabel} href={backButtonHref} />
        </CardFooter>
      </CardHeader>
    </Card>
  );
};

const AuthHeader = ({ title, label }: { title: string; label: string }) => {
  return (
    <>
      <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      <CardDescription className="font-medium text-muted-foreground">
        {label}
      </CardDescription>
    </>
  );
};

const BackButton = ({ label, href }: { label: string; href: string }) => {
  return (
    <Button variant={"link"} className="font-normal w-full" size={"sm"} asChild>
      <Link to={href}>{label}</Link>
    </Button>
  );
};

export default CardWrapper;
