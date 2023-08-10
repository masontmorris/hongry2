import React from "react";
import { useForm, useFieldArray } from "react-hook-form";

function RecipeForm() {
    const { register, handleSubmit, control } = useForm({
        defaultValues: {
            ingredients: [{ name: "", quantity: "", unit: "" }],
        },
    });

    const { fields, append } = useFieldArray({
        control,
        name: "ingredients",
    });

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="name">Name</label>
            <input id="name" {...register("name")} />

            {fields.map((item, index) => (
                <div key={item.id}>
                    <label htmlFor={`ingredients.${index}.name`}>Name</label>
                    <input id={`ingredients.${index}.name`} {...register(`ingredients.${index}.name`)} />

                    <label htmlFor={`ingredients.${index}.quantity`}>Quantity</label>
                    <input id={`ingredients.${index}.quantity`} {...register(`ingredients.${index}.quantity`)} />

                    <label htmlFor={`ingredients.${index}.unit`}>Unit</label>
                    <input id={`ingredients.${index}.unit`} {...register(`ingredients.${index}.unit`)} />
                </div>
            ))}

            <button type="button" onClick={() => append({})}>
                Add Ingredient
            </button>

            {/* Steps */}
            {/* ... */}

            {/* Images */}
            {/* ... */}

            <button type="submit">Submit</button>
        </form>
    );
}
export default RecipeForm;
