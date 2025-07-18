import { Prisma } from "@prisma/client";

export const itemSelect: Prisma.ItemSelect = {
        id: true,
        name: true,
        description: true,
        brand: true,
        imgUrl: true,
        quantity: true,
        borrowed_quantity: true,
        category: true,
        condition_status: true,
        availability_status: true,
        loan_items: {
          include: {
            item: {
              select: {
                id: true,
                name: true,
                description: true,
                category: true,
                condition_status: true,
                borrowed_quantity: true,
                availability_status: true,
              },
            },
          },
        },
        pair_id: true,
        status_notes: true,
        created_at: true,
        updated_at: true,
};