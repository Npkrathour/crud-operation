"use client";
export const dynamic = "force-dynamic";
import * as z from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { StepBack } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  number: z
    .string()
    .min(10)
    .max(10, "Phone number must be 10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  desc: z.string().min(10).max(200),
});

const Create = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      number: "",
      desc: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);

    const { error } = await supabase
      .from("student_table")
      .insert([data])
      .select();

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Form submitted successfully 🎉");
    router.push("/crudlist");
    form.reset();
  };

  return (
    <div>
      <div className="p-5 flex justify-center items-center min-h-screen flex-col">
        <div className="flex items-center justify-center max-w-md w-full mb-3 gap-2">
          <StepBack
            onClick={() => router.push("/crudlist")}
            className="text-white rounded-md cursor-pointer border  border-gray-500 p-1 size-8"
          />

          <p className="text-gray-300 text-xl font-inter font-semibold">
            Create New Entry
          </p>
        </div>
        <Card className="w-full sm:max-w-md bg-gray-600/20 border border-gray-600 hover:border-gray-500 text-white backdrop-blur-sm">
          <CardContent>
            <form
              id="contact-form"
              autoComplete="off"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FieldGroup>
                {/* Name */}
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Name</FieldLabel>
                      <Input {...field} placeholder="John Doe" />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Email */}
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Email</FieldLabel>
                      <Input {...field} type="email" />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Phone */}
                <Controller
                  name="number"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Phone</FieldLabel>
                      <Input {...field} />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Message */}
                <Controller
                  name="desc"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Message</FieldLabel>
                      <InputGroup>
                        <InputGroupTextarea
                          {...field}
                          rows={5}
                          maxLength={200}
                        />
                        <InputGroupAddon align="block-end">
                          <InputGroupText>
                            {field.value.length}/200
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      <FieldDescription>
                        Tell us how we can help you.
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              form="contact-form"
              disabled={loading}
              className="w-full bg-gray-900 border border-gray-500 hover:bg-gray-800 cursor-pointer"
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Create;
