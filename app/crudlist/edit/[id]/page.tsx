"use client";
export const dynamic = "force-dynamic";

import * as z from "zod";
import { toast } from "sonner";
import { useEffect, useState, use } from "react";
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
  name: z.string().min(2),
  email: z.string().email(),
  number: z
    .string()
    .min(10)
    .max(15)
    .regex(/^\d+$/, "Phone number must contain only digits"),
  desc: z.string().min(10).max(200),
});

export const Skelton = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-700 rounded w-3/4"></div>
      <div className="h-6 bg-gray-700 rounded w-full"></div>
      <div className="h-6 bg-gray-700 rounded w-5/6"></div>
      <div className="h-24 bg-gray-700 rounded w-full"></div>
    </div>
  );
};

const Edit = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      number: "",
      desc: "",
    },
  });

  useEffect(() => {
    const fetchStudent = async () => {
      const { data, error } = await supabase
        .from("student_table")
        .select("*")
        .eq("id", Number(id))
        .single();

      if (error || !data) {
        toast.error("Student not found");
        router.push("/crudlist");
        return;
      }

      form.reset({
        name: data.name,
        email: data.email,
        number: data.number,
        desc: data.desc,
      });

      setPageLoading(false);
    };

    fetchStudent();
  }, [id, form, router]);

  /* =====================
     UPDATE STUDENT
  ===================== */
  const updateStudent = async (formData: z.infer<typeof formSchema>) => {
    setLoading(true);

    const { error } = await supabase
      .from("student_table")
      .update(formData)
      .eq("id", Number(id));

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Student updated successfully!");
    router.push("/crudlist");
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        {<Skelton />}
      </div>
    );
  }

  return (
    <div className="p-5 flex  flex-col justify-center items-center min-h-screen">
      <div className="flex items-center justify-center max-w-md w-full mb-3 gap-2">
        <StepBack
          onClick={() => router.push("/crudlist")}
          className="text-white rounded-md cursor-pointer border  border-gray-500 p-1 size-8"
        />

        <p className="text-gray-300 text-xl font-inter font-semibold">
          Update Entry
        </p>
      </div>
      <Card className="w-full sm:max-w-md bg-gray-600/20 border border-gray-600 text-white">
        <CardContent>
          <form
            id="edit-form"
            autoComplete="off"
            onSubmit={form.handleSubmit(updateStudent)}
          >
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Name</FieldLabel>
                    <Input {...field} />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Email</FieldLabel>
                    <Input {...field} type="email" />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                name="number"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Phone</FieldLabel>
                    <Input {...field} />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                name="desc"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Message</FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea {...field} rows={5} />
                      <InputGroupAddon align="block-end">
                        <InputGroupText>
                          {field.value.length}/200
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    <FieldDescription>
                      Update student description
                    </FieldDescription>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            form="edit-form"
            disabled={loading}
            className="w-full bg-gray-900 border border-gray-500 hover:bg-gray-800 cursor-pointer"
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Edit;
