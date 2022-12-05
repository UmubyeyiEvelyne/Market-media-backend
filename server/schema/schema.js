const Product = require("../models/Product");
const Business = require("../models/Business");
const Order = require("../models/Order");
const Review = require("../models/Review");
const User = require("../models/User");
const Cart = require("../models/Cart");
const Category = require("../models/Category");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
} = require("graphql");

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    password: { type: GraphQLString },
    category: { type: GraphQLString },
  }),
});

const OrderType = new GraphQLObjectType({
  name: "Order",
  fields: () => ({
    id: { type: GraphQLID },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId);
      },
    },
    product: {
      type: ProductType,
      resolve(parent, args) {
        return Product.findById(parent.productId);
      },
    },
    quantity: { type: GraphQLFloat },
    business: {
      type: BusinessType,
      resolve(parent, args) {
        return Business.findById(parent.businessId);
      },
    },
    phoneNumber: { type: GraphQLString },
    shippingAddress: { type: GraphQLString },
    shippingMethod: { type: GraphQLString },
  }),
});

const ReviewType = new GraphQLObjectType({
  name: "Review",
  fields: () => ({
    id: { type: GraphQLID },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId);
      },
    },
    business: {
      type: BusinessType,
      resolve(parent, args) {
        return Business.findById(parent.businessId);
      },
    },
    rating: { type: GraphQLInt },
    comment: { type: GraphQLString },
  }),
});

const BusinessType = new GraphQLObjectType({
  name: "Business",
  fields: () => ({
    id: { type: GraphQLID },
    image: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    webLink: { type: GraphQLString },
    socialMediaLink: { type: GraphQLString },
    email: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    province: { type: GraphQLString },
    district: { type: GraphQLString },
    streetAddress: { type: GraphQLString },
    otherAddressDescription: { type: GraphQLString },
    legalDocument: { type: GraphQLString },
    applicationStatus: { type: GraphQLString },
    owner: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.ownerId);
      },
    },
  }),
});

const ProductType = new GraphQLObjectType({
  name: "Product",
  fields: () => ({
    id: { type: GraphQLID },
    image: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    category: {
      type: CategoryType,
      resolve(parent, args) {
        return Category.findById(parent.categoryId);
      },
    },
    unit: { type: GraphQLString },
    quantity: { type: GraphQLFloat },
    price: { type: GraphQLFloat },
    businessId: {
      type: BusinessType,
      resolve(parent, args) {
        return Business.findById(parent.businessId);
      },
    },
  }),
});

const CategoryType = new GraphQLObjectType({
  name: "Category",
  fields: () => ({
    id: { type: GraphQLID },
    image: { type: GraphQLString },
    name: { type: GraphQLString },
    products: {
      type: new GraphQLList(ProductType),
      resolve(parent, args) {
        return Product.find({ categoryId: parent.id });
      },
    },
  }),
});

const CartType = new GraphQLObjectType({
  name: "Cart",
  fields: () => ({
    id: { type: GraphQLID },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId);
      },
    },
    product: {
      type: ProductType,
      resolve(parent, args) {
        return Product.findById(parent.productId);
      },
    },
  }),
});

const AuthDataType = new GraphQLObjectType({
  name: "AuthData",
  fields: () => ({
    userId: { type: GraphQLID },
    userRole: { type: GraphQLString },
    token: { type: GraphQLString },
    tokenExpiration: { type: GraphQLInt },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    login: {
      type: AuthDataType,
      args: {
        email: { type: GraphQLID },
        password: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const user = await User.findOne({ email: args.email });
        if (!user) {
          throw new Error("user does not exists!");
        }

        const isEqual = await bcrypt.compare(args.password, user.password);

        if (!isEqual) {
          throw new Error("Password is  incorrect!");
        }

        const token = jwt.sign(
          { userId: user.id, userRole: user.category, email: user.email },
          "mysupersecretkey",
          {
            expiresIn: "1h",
          }
        );

        console.log(user.category);

        return {
          userId: user.id,
          userRole: user.category,
          token: token,
          tokenExpiration: 1,
        };
      },
    },
    categories: {
      type: new GraphQLList(CategoryType),
      resolve(parent, args) {
        return Category.find();
      },
    },
    category: { 
      type: CategoryType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Category.findById(args.id);
      },
    },
    products: {
      type: new GraphQLList(ProductType),
      resolve(parent, args) {
        return Product.find();
      },
    },
    product: {
      type: ProductType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Product.findById(args.id);
      },
    },
    businesses: {
      type: new GraphQLList(BusinessType),
      resolve(parent, args) {
        return Business.find();
      },
    },
    business: {
      type: BusinessType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Business.findById(args.id);
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.find();
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return User.findById(args.id);
      },
    },
    orders: {
      type: new GraphQLList(OrderType),
      resolve(parent, args) {
        return Order.find();
      },
    },
    order: {
      type: OrderType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Order.findById(args.id);
      },
    },
    cartItems: {
      type: new GraphQLList(CartType),
      resolve(parent, args) {
        return Cart.find();
      },
    },
    cartItem: {
      type: CartType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Cart.findById(args.id);
      },
    },
    reviews: {
      type: new GraphQLList(ReviewType),
      resolve(parent, args) {
        return Review.find();
      },
    },
    review: {
      type: ReviewType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Review.findById(args.id);
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // Product
    addProduct: {
      type: ProductType,
      args: {
        image: { type: GraphQLString },
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        categoryId: { type: GraphQLNonNull(GraphQLID) },
        unit: { type: new GraphQLNonNull(GraphQLString) },
        quantity: { type: new GraphQLNonNull(GraphQLFloat) },
        price: { type: new GraphQLNonNull(GraphQLFloat) },
        businessId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args, req) {
        // if (!req.isAuth){
        //   throw new Error('Unauthenticated');
        // }
        // console.log("req.role", req.userRole);

        // if (req.userRole === "Buyer" || req.userRole === "Admin") {
        //   throw new Error('The user is not a seller');
        // }

        const product = new Product({
          image: args.image,
          name: args.name,
          description: args.description,
          categoryId: args.categoryId,
          unit: args.unit,
          quantity: args.quantity,
          price: args.price,
          businessId: args.businessId,
        });

        return product.save();
      },
    },
    deleteProduct: {
      type: ProductType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args, req) {
        // if (!req.isAuth){
        //   throw new Error('Unauthenticated');
        // }
        // if (!req.userRole === "Seller" || !req.userRole === "Admin") {
        //   throw new Error('The user is not a seller or an admin');
        // }
        return Product.findByIdAndRemove(args.id);
      },
    },
    updateProduct: {
      type: ProductType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        image: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        category: { type: GraphQLID },
        unit: { type: GraphQLString },
        quantity: { type: GraphQLFloat },
        price: { type: GraphQLFloat },
      },
      resolve(parent, args, req) {
        // if (!req.isAuth){
        //   throw new Error('Unauthenticated');
        // }
        // if (!req.userRole === "Seller") {
        //   throw new Error('The user is not a seller');
        // }
        return Product.findByIdAndUpdate(
          args.id,
          {
            $set: {
              image: args.image,
              name: args.name,
              description: args.description,
              category: args.category,
              unit: args.unit,
              quantity: args.quantity,
              price: args.price,
            },
          },
          { new: true }
        );
      },
    },

    // category
    addCategory: {
      type: CategoryType,
      args: {
        image: { type: GraphQLString },
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const category = new Category({
          image: args.image,
          name: args.name,
        });

        return category.save();
      },
    },

    // order
    addOrder: {
      type: OrderType,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLID) },
        productId: { type: new GraphQLNonNull(GraphQLID) },
        quantity: { type: new GraphQLNonNull(GraphQLFloat) },
        businessId: { type: new GraphQLNonNull(GraphQLID) },
        phoneNumber: { type: new GraphQLNonNull(GraphQLString) },
        shippingAddress: { type: new GraphQLNonNull(GraphQLString) },
        shippingMethod: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args, req) {
        // if (!req.isAuth){
        //   throw new Error('Unauthenticated');
        // }
        const order = new Order({
          userId: args.userId,
          productId: args.productId,
          quantity: args.quantity,
          businessId: args.businessId,
          phoneNumber: args.phoneNumber,
          shippingAddress: args.shippingAddress,
          shippingMethod: args.shippingMethod,
        });

        return order.save();
      },
    },

    // Cart
    addCartItem: {
      type: CartType,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLID) },
        productId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args, req) {
        // if (!req.isAuth){
        //   throw new Error('Unauthenticated');
        // }
        const cart = new Cart({
          userId: args.userId,
          productId: args.productId,
        });

        return cart.save();
      },
    },
    // Review
    addReview: {
      type: ReviewType,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLID) },
        businessId: { type: new GraphQLNonNull(GraphQLID) },
        rating: { type: new GraphQLNonNull(GraphQLInt) },
        comment: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args, req) {
        // if (!req.isAuth){
        //   throw new Error('Unauthenticated');
        // }
        const review = new Review({
          userId: args.userId,
          businessId: args.businessId,
          rating: args.rating,
          comment: args.comment,
        });

        return review.save();
      },
    },

    // business
    addBusiness: {
      type: BusinessType,
      args: {
        image: { type: GraphQLString },
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        webLink: { type: GraphQLString },
        socialMediaLink: { type: GraphQLString },
        email: { type: new GraphQLNonNull(GraphQLString) },
        phoneNumber: { type: new GraphQLNonNull(GraphQLString) },
        province: { type: new GraphQLNonNull(GraphQLString) },
        district: { type: new GraphQLNonNull(GraphQLString) },
        streetAddress: { type: new GraphQLNonNull(GraphQLString) },
        otherAddressDescription: { type: GraphQLString },
        legalDocument: { type: new GraphQLNonNull(GraphQLString) },
        applicationStatus: {
          type: new GraphQLEnumType({
            name: "ApplicationStatus",
            values: {
              approved: { value: "Approved" },
              rejected: { value: "Rejected" },
              pending: { value: "Pending" },
            },
          }),
          defaultValue: "Pending",
        },
        ownerId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args, req) {
        // if (!req.isAuth){
        //   throw new Error('Unauthenticated');
        // }
        const business = new Business({
          image: args.image,
          name: args.name,
          description: args.description,
          webLink: args.webLink,
          socialMediaLink: args.socialMediaLink,
          email: args.email,
          phoneNumber: args.phoneNumber,
          province: args.province,
          district: args.district,
          streetAddress: args.streetAddress,
          otherAddressDescription: args.otherAddressDescription,
          legalDocument: args.legalDocument,
          applicationStatus: args.applicationStatus,
          ownerId: args.ownerId,
        });

        return business.save();
      },
    },

    deleteBusiness: {
      type: BusinessType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args, req) {
        // if (!req.isAuth){
        //   throw new Error('Unauthenticated');
        // }
        Product.find({ businessId: args.id }).then((products) => {
          products.forEach((product) => {
            product.remove();
          });
        });
        Order.find({ businessId: args.id }).then((orders) => {
          orders.forEach((order) => {
            order.remove();
          });
        });
        Review.find({ businessId: args.id }).then((reviews) => {
          reviews.forEach((review) => {
            review.remove();
          });
        });
        return Business.findByIdAndRemove(args.id);
      },
    },
    updateBusiness: {
      type: BusinessType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        image: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        webLink: { type: GraphQLString },
        socialMediaLink: { type: GraphQLString },
        email: { type: GraphQLString },
        phoneNumber: { type: GraphQLString },
        province: { type: GraphQLString },
        district: { type: GraphQLString },
        streetAddress: { type: GraphQLString },
        otherAddressDescription: { type: GraphQLString },
        legalDocument: { type: GraphQLString },
        applicationStatus: {
          type: new GraphQLEnumType({
            name: "BusinessStatusUpdate",
            values: {
              approved: { value: "Approved" },
              rejected: { value: "Rejected" },
              pending: { value: "Pending" },
            },
          }),
        },
        ownerId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args, req) {
        // if (!req.isAuth){
        //   throw new Error('Unauthenticated');
        // }
        return Business.findByIdAndUpdate(
          args.id,
          {
            $set: {
              image: args.image,
              name: args.name,
              description: args.description,
              webLink: args.webLink,
              socialMediaLink: args.socialMediaLink,
              email: args.email,
              phoneNumber: args.phoneNumber,
              province: args.province,
              district: args.district,
              streetAddress: args.streetAddress,
              otherAddressDescription: args.otherAddressDescription,
              legalDocument: args.legalDocument,
              applicationStatus: args.applicationStatus,
              ownerId: args.ownerId,
            },
          },
          { new: true }
        );
      },
    },

    // user
    addUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        phoneNumber: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        category: {
          type: new GraphQLEnumType({
            name: "category",
            values: {
              admin: { value: "Admin" },
              seller: { value: "Seller" },
              buyer: { value: "Buyer" },
            },
          }),
          defaultValue: "Buyer",
        },
      },

      async resolve(parent, args) {
        const user = new User({
          name: args.name,
          email: args.email,
          phoneNumber: args.phoneNumber,
          password: await bcrypt.hash(args.password, 12),
          category: args.category,
        });

        return user.save();
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args, req) {
        // if (!req.isAuth){
        //   throw new Error('Unauthenticated');
        // }
        return User.findByIdAndRemove(args.id);
      },
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phoneNumber: { type: GraphQLString },
        password: { type: GraphQLString },
        category: {
          type: new GraphQLEnumType({
            name: "userCategoryUpdate",
            values: {
              admin: { value: "Admin" },
              seller: { value: "Seller" },
              buyer: { value: "Buyer" },
            },
          }),
        },
      },
      async resolve(parent, args, req) {
        // if (!req.isAuth){
        //   throw new Error('Unauthenticated');
        // }
        return User.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              email: args.email,
              phoneNumber: args.phoneNumber,
              password: await bcrypt.hash(args.password, 12),
              category: args.category,
            },
          },
          { new: true }
        );
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation,
});
