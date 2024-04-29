import { useDB } from "./config/db";
import { ENV } from "./constant/environment";
import express, { Request, Response } from "express";
import http from "http";
import userRouter from "./routes/userRoutes";
import leadRouter from "./routes/leadRoutes";
import leadDetailsRoutes from "./routes/leadDetailsRoute";
import productRoute from "./routes/product";
import roleRoute from "./routes/role";
import statusRoute from "./routes/status";
import { checkReminders } from "./service/reminderServices";
import sourceRoute from "./routes/sourceRoute";
import notificationRouter from "./routes/notification";
import customFieldCatergoryRouter from "./routes/customFieldCategories";
import customFieldRoute from "./routes/customFields";

const app = express();
const server = http.createServer(app);
const cors = require('cors');

app.use(express.json());
// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.get("/crm/health", (req: Request, res: Response) => {
  res.json({ message: "Hello! ,welcome to crm-service" });
});

app.use("/crm/", userRouter);
app.use("/crm/", leadRouter);
app.use("/crm/", leadDetailsRoutes);
app.use("/crm/", productRoute);
app.use("/crm/", roleRoute);
app.use("/crm/", statusRoute);
app.use("/crm/", sourceRoute);
app.use("/crm/", notificationRouter);
app.use("/crm/",customFieldCatergoryRouter)

app.use("/crm/",customFieldRoute)

server.listen(ENV.PORT, async () => {
    await useDB();
    console.log(`Server started on port ${ENV.PORT}`);
  });
  const io = require('socket.io')(server,{
    path:'/socket',
    cors: {   origin: "*",   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]},
  });
  io.on('connection', (socket:any) => {
    console.log('New client connected');
    
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
  
  const checkRemindersPolling = async () => {
    const reminders =  await checkReminders()
    // console.log(reminders)
    var ReminderArr: any[] = [];
    reminders.forEach(reminder => {
      const objectIdString = reminder.user_id.toString();
      const objectIdValue = objectIdString.substring(0, 24);
      const objectIdStringLead = reminder._id.toString();
      const objectIdValueLead = objectIdStringLead.substring(0, 24);

      ReminderArr.push({ id: objectIdValue,name: reminder.name , reminder_date:reminder.reminderAt ,status:reminder.status[0].status ,leadId:objectIdValueLead});
      // console.log({ id: objectIdValue,name: reminder.name , reminder_date:reminder.reminderAt ,status:reminder.status[0].status ,leadId:objectIdValueLead},'--end--')
      io.emit(objectIdValue, { id: objectIdValue,name: reminder.name , reminder_date:reminder.reminderAt ,status:reminder.status[0].status ,leadId:objectIdValueLead});
    });
  };
  
  setInterval(checkRemindersPolling, 6000);

  export const NotiIo = io;
