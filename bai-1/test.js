const baseUrl = "http://localhost:5000/api";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const runAllTests = async () => {
  try {
    console.log("=== BẮT ĐẦU KIỂM THỬ HỆ THỐNG ===");

    const timestamp = Date.now();
    const staffEmail = `staff_${timestamp}@gmail.com`;
    const adminEmail = `admin_${timestamp}@gmail.com`;

    console.log("\n1. ĐĂNG KÝ TÀI KHOẢN STAFF");
    const regStaffRes = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Nguyễn Văn Nhân Viên",
        email: staffEmail,
        password: "password123",
        role: "staff"
      })
    });
    const regStaffData = await regStaffRes.json();
    console.log("Status:", regStaffRes.status);
    console.log("Response:", JSON.stringify(regStaffData, null, 2));

    console.log("\n2. ĐĂNG NHẬP VỚI TÀI KHOẢN STAFF");
    const loginStaffRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: staffEmail,
        password: "password123"
      })
    });
    const loginStaffData = await loginStaffRes.json();
    console.log("Status:", loginStaffRes.status);
    console.log("Token:", loginStaffData.token ? "Đã lấy được token" : "Không có token");
    const staffToken = loginStaffData.token;

    console.log("\n3. LẤY THÔNG TIN TÀI KHOẢN HIỆN TẠI (/api/auth/me)");
    const meRes = await fetch(`${baseUrl}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${staffToken}`
      }
    });
    const meData = await meRes.json();
    console.log("Status:", meRes.status);
    console.log("Response:", JSON.stringify(meData, null, 2));

    console.log("\n4. ĐĂNG KÝ TÀI KHOẢN ADMIN");
    const regAdminRes = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Trần Quản Trị Viên",
        email: adminEmail,
        password: "password123",
        role: "admin"
      })
    });
    const regAdminData = await regAdminRes.json();
    console.log("Status:", regAdminRes.status);

    console.log("\n5. ĐĂNG NHẬP VỚI TÀI KHOẢN ADMIN");
    const loginAdminRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: adminEmail,
        password: "password123"
      })
    });
    const loginAdminData = await loginAdminRes.json();
    console.log("Status:", loginAdminRes.status);
    const adminToken = loginAdminData.token;

    console.log("\n6. TEST PHÂN QUYỀN: STAFF TẠO PHÒNG BAN (KỲ VỌNG 403)");
    const staffCreateDeptRes = await fetch(`${baseUrl}/departments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${staffToken}`
      },
      body: JSON.stringify({
        name: "Phòng Kỹ Thuật",
        code: `TECH_${timestamp}`
      })
    });
    const staffCreateDeptData = await staffCreateDeptRes.json();
    console.log("Status:", staffCreateDeptRes.status);
    console.log("Response:", JSON.stringify(staffCreateDeptData, null, 2));

    console.log("\n7. ADMIN TẠO PHÒNG BAN MỚI (KỲ VỌNG 201)");
    const adminCreateDeptRes = await fetch(`${baseUrl}/departments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: "Phòng Kỹ Thuật",
        code: `TECH_${timestamp}`,
        description: "Phòng phát triển phần mềm"
      })
    });
    const adminCreateDeptData = await adminCreateDeptRes.json();
    console.log("Status:", adminCreateDeptRes.status);
    console.log("Response:", JSON.stringify(adminCreateDeptData, null, 2));
    const departmentId = adminCreateDeptData.data ? adminCreateDeptData.data._id : null;

    console.log("\n8. LẤY DANH SÁCH PHÒNG BAN");
    const getDeptsRes = await fetch(`${baseUrl}/departments`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${staffToken}`
      }
    });
    const getDeptsData = await getDeptsRes.json();
    console.log("Status:", getDeptsRes.status);
    console.log("Số lượng phòng ban:", getDeptsData.data ? getDeptsData.data.length : 0);

    if (departmentId) {
      console.log("\n9. CẬP NHẬT PHÒNG BAN (ADMIN)");
      const updateDeptRes = await fetch(`${baseUrl}/departments/${departmentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          name: "Phòng Công Nghệ & Kỹ Thuật"
        })
      });
      const updateDeptData = await updateDeptRes.json();
      console.log("Status:", updateDeptRes.status);
      console.log("Response:", JSON.stringify(updateDeptData, null, 2));

      console.log("\n10. XÓA MỀM PHÒNG BAN (ADMIN)");
      const deleteDeptRes = await fetch(`${baseUrl}/departments/${departmentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      });
      const deleteDeptData = await deleteDeptRes.json();
      console.log("Status:", deleteDeptRes.status);
      console.log("Response (Trạng thái sau xóa mềm):", deleteDeptData.data ? deleteDeptData.data.status : "N/A");
    }

    console.log("\n11. ADMIN TẠO CHỨC VỤ MỚI (KỲ VỌNG 201)");
    const createPosRes = await fetch(`${baseUrl}/positions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: "Lập Trình Viên Senior",
        code: `DEV_SR_${timestamp}`,
        baseSalary: 25000000
      })
    });
    const createPosData = await createPosRes.json();
    console.log("Status:", createPosRes.status);
    console.log("Response:", JSON.stringify(createPosData, null, 2));
    const positionId = createPosData.data ? createPosData.data._id : null;

    console.log("\n12. LẤY DANH SÁCH CHỨC VỤ");
    const getPositionsRes = await fetch(`${baseUrl}/positions`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${staffToken}`
      }
    });
    const getPositionsData = await getPositionsRes.json();
    console.log("Status:", getPositionsRes.status);
    console.log("Số lượng chức vụ:", getPositionsData.data ? getPositionsData.data.length : 0);

    if (positionId) {
      console.log("\n13. XÓA MỀM CHỨC VỤ (ADMIN)");
      const deletePosRes = await fetch(`${baseUrl}/positions/${positionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      });
      const deletePosData = await deletePosRes.json();
      console.log("Status:", deletePosRes.status);
      console.log("Response (Trạng thái sau xóa mềm):", deletePosData.data ? deletePosData.data.status : "N/A");
    }

    console.log("\n=== TẤT CẢ KIỂM THỬ ĐÃ HOÀN TẤT THÀNH CÔNG! ===");
  } catch (err) {
    console.error("Lỗi khi kiểm thử:", err.message);
    console.log("Hãy đảm bảo server đang chạy trên cổng 5000 (npm run dev hoặc npm start)");
  }
};

runAllTests();
