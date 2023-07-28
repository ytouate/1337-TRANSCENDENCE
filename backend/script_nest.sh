sleep 10
npx prisma migrate dev --name init
exec $@